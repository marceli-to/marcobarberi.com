// -------------------------------------------------------
// Vimeo-backed showcase player (TEST)
//
// Drop-in counterpart to modules/video-player.js. Instead of driving a native
// <video> element it drives a Vimeo embed through the official Player SDK,
// while keeping the exact same control markup and data-* hooks so the two
// variants can be compared side by side.
//
// Why Vimeo: the self-hosted MP4s are 70-220 MB and are delivered as a
// progressive download, so the browser has to pull the whole file through a
// single connection. Vimeo serves adaptive HLS/DASH, which starts on a low
// rendition within a few hundred kilobytes and steps up from there.
//
// The iframe is created lazily (see #ensureLoaded) so that opening the page
// does not spin up four Vimeo players at once. Until a player exists the
// poster image is shown as a facade.
// -------------------------------------------------------

import Player from '@vimeo/player';

const BREAKPOINT = 1024;

// container element -> VimeoShowcasePlayer
const registry = new Map();

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Which variant of the test page this is. /vimeo-preload marks its showcase
// wrapper with data-preload; /vimeo does not. Read once — it cannot change
// without a page load.
export const PRELOAD = document
  .querySelector('[data-showcases]')
  ?.hasAttribute('data-preload') ?? false;

export function playerFor(container) {
  return registry.get(container);
}

export function allPlayers() {
  return [...registry.values()];
}

export class VimeoShowcasePlayer {
  #container;
  #stage;
  #poster;
  #spinner;
  #playBtn;
  #pauseBtn;
  #muteBtn;
  #unmuteBtn;
  #fullscreenBtn;
  #progressBar;
  #progressTrack;
  #progressFilled;
  #progressHandle;
  #timeRemainingEl;
  #controls;

  #player = null;
  #loading = null;
  #isPlaying = false;
  #muted = true;
  #duration = 0;
  #videoAspect = null;
  #controlsTimeout = null;
  #abortController;
  #embedStartedAt = 0;
  #playRequestedAt = 0;
  #firstFrameLogged = false;
  #prewarming = false;
  #prewarmed = false;
  #prewarmAborted = false;

  constructor(container) {
    this.#container = container;
    this.#stage = container.querySelector('[data-vimeo-stage]');
    this.#poster = container.querySelector('[data-poster]');
    this.#spinner = container.querySelector('[data-spinner]');
    this.#playBtn = container.querySelector('[data-play-btn]');
    this.#pauseBtn = container.querySelector('[data-pause-btn]');
    this.#muteBtn = container.querySelector('[data-mute-btn]');
    this.#unmuteBtn = container.querySelector('[data-unmute-btn]');
    this.#fullscreenBtn = container.querySelector('[data-fullscreen-btn]');
    this.#progressBar = container.querySelector('[data-progress-bar]');
    this.#progressTrack = container.querySelector('[data-progress-track]');
    this.#progressFilled = container.querySelector('[data-progress-filled]');
    this.#progressHandle = container.querySelector('[data-progress-handle]');
    this.#timeRemainingEl = container.querySelector('[data-time-remaining]');
    this.#controls = container.querySelector('[data-controls]');

    if (!this.#stage || !container.dataset.vimeoId) {
      console.warn('VimeoShowcasePlayer: missing stage or vimeo id', container);
      return;
    }

    this.#muted = container.hasAttribute('data-muted');
    this.#abortController = new AbortController();
    this.#updateMuteButton();
    this.#bindEvents();

    registry.set(container, this);
  }

  // -----------------------------------------------------
  // Lazy embed creation
  // -----------------------------------------------------

  /**
   * Create the Vimeo iframe on first use and resolve once the SDK reports the
   * video as ready. Repeat calls return the same promise.
   */
  ensureLoaded() {
    if (this.#loading) return this.#loading;

    const { vimeoId, vimeoHash } = this.#container.dataset;

    const options = {
      controls: false,      // we render our own control bar
      dnt: true,            // no Vimeo tracking cookies
      muted: this.#muted,
      loop: this.#container.hasAttribute('data-loop'),
      playsinline: true,
      autopause: false,     // slide changes are orchestrated by us
      title: false,
      byline: false,
      portrait: false,
      keyboard: false,
      transparent: false,
    };

    // Unlisted videos need the privacy hash, which the SDK only accepts as
    // part of a full URL.
    if (vimeoHash) {
      options.url = `https://vimeo.com/${vimeoId}/${vimeoHash}`;
    } else {
      options.id = Number(vimeoId);
    }

    this.#showSpinner();
    this.#embedStartedAt = performance.now();
    this.#player = new Player(this.#stage, options);

    this.#loading = this.#player
      .ready()
      .then(() => Promise.all([
        this.#player.getVideoWidth(),
        this.#player.getVideoHeight(),
        this.#player.getDuration(),
      ]))
      .then(([w, h, duration]) => {
        this.#videoAspect = w && h ? w / h : null;
        this.#duration = duration || 0;
        this.#fit();
        this.#updateTimeRemaining(0);
        this.#bindPlayerEvents();
        this.#hideSpinner();
        return this.#player;
      })
      .catch((e) => {
        console.warn('VimeoShowcasePlayer: embed failed', e?.message || e);
        this.#hideSpinner();
        throw e;
      });

    return this.#loading;
  }

  /** True once the iframe has been created (not necessarily ready yet). */
  get isLoaded() {
    return this.#loading !== null;
  }

  /**
   * Preload the *content*, not just the player — used only by the
   * /vimeo-preload variant.
   *
   * ensureLoaded() alone gets the iframe, the SDK and the stream manifest in
   * place, but no video data. Vimeo offers no "preload" switch, so the only
   * way to force the first segments into the buffer is to actually start
   * playback muted and stop it again immediately. #prewarming suppresses the
   * UI side effects of those events, so the poster stays up and the control
   * bar keeps showing "paused" while this happens off screen.
   */
  async prewarm() {
    await this.ensureLoaded();
    if (this.#prewarmed) return;
    this.#prewarmed = true;
    this.#prewarming = true;
    this.#prewarmAborted = false;

    try {
      await this.#player.setMuted(true);

      // Stop as soon as the first frames are actually in the buffer. Awaiting
      // play() instead would hang for as long as the network needs, and on a
      // slow link that leaves #prewarming latched for many seconds — long
      // enough to swallow the UI updates of a real play() in between.
      const firstFrames = new Promise((resolve) => {
        const onTick = () => {
          this.#player.off('timeupdate', onTick);
          resolve();
        };
        this.#player.on('timeupdate', onTick);
      });

      this.#player.play().catch(() => {});
      await Promise.race([firstFrames, wait(4000)]);
    } catch {
      // Autoplay can be refused for the off-screen player; the embed itself
      // is loaded either way, so this is a partial win, not a failure.
    } finally {
      this.#prewarming = false;

      // If the viewer reached this slide while we were prewarming, the video
      // is legitimately playing now — pausing it here would fight the user.
      if (!this.#prewarmAborted) {
        this.#player.pause()
          .then(() => this.#player.setCurrentTime(0))
          .then(() => this.#player.setMuted(this.#muted))
          .catch(() => {});
      }
    }
  }


  #bindPlayerEvents() {
    const p = this.#player;

    // While prewarming, playback is started and stopped purely to fill the
    // buffer — none of it should reach the UI.
    p.on('play', () => {
      if (this.#prewarming) return;
      this.#isPlaying = true;
      this.#updatePlayButton();
      this.#hidePoster();
      this.#hideSpinner();
      this.#logFirstFrame();
    });

    p.on('pause', () => {
      if (this.#prewarming) return;
      this.#isPlaying = false;
      this.#updatePlayButton();
    });

    p.on('ended', () => {
      this.#isPlaying = false;
      this.#updatePlayButton();
    });

    p.on('timeupdate', ({ seconds, duration }) => {
      this.#duration = duration || this.#duration;
      this.#updateProgress(seconds);
      this.#updateTimeRemaining(seconds);
    });

    // A rewind while paused produces no timeupdate, so the bar has to be
    // moved back from the seek event itself.
    p.on('seeked', ({ seconds, duration }) => {
      this.#duration = duration || this.#duration;
      this.#updateProgress(seconds);
      this.#updateTimeRemaining(seconds);
    });

    // Adaptive streaming still rebuffers on a bad connection; surface it.
    p.on('bufferstart', () => this.#prewarming || this.#showSpinner());
    p.on('bufferend', () => this.#hideSpinner());

    p.on('error', (e) => console.warn('Vimeo player error', e));
  }

  // -----------------------------------------------------
  // Public control surface (mirrors VideoPlayer)
  // -----------------------------------------------------

  #togglePlay() {
    return this.#isPlaying ? this.pause() : this.play();
  }

  play() {
    this.#playRequestedAt = performance.now();

    // A real play request always outranks an in-flight prewarm: let UI events
    // through again immediately, and stop the prewarm from pausing us.
    this.#prewarmAborted = true;
    this.#prewarming = false;

    return this.ensureLoaded()
      .then((p) => p.play())
      .catch((e) => {
        // Autoplay rejections are expected when the browser blocks playback.
        if (e?.name !== 'AbortError') {
          console.log('Vimeo playback prevented:', e?.message || e);
        }
      });
  }

  pause() {
    if (!this.#player) return Promise.resolve();
    return this.#player.pause().catch(() => {});
  }

  /**
   * Pause and rewind — used when a slide leaves the viewport.
   *
   * This only issues commands; the UI is updated from the player's own
   * `pause` and `seeked` events. Writing button state in a `.then()` here
   * would race with a `play()` issued right afterwards and could land last,
   * leaving the bar showing "paused" over a running video.
   */
  reset() {
    if (!this.#player) return Promise.resolve();
    return this.#player
      .pause()
      .then(() => this.#player.setCurrentTime(0))
      .catch(() => {});
  }

  mute() {
    this.#muted = true;
    this.#updateMuteButton();
    this.#player?.setMuted(true).catch(() => {});
  }

  unmute() {
    this.#muted = false;
    this.#updateMuteButton();
    this.#player?.setMuted(false).catch(() => {});
  }

  destroy() {
    this.#abortController?.abort();
    clearTimeout(this.#controlsTimeout);
    this.#player?.destroy().catch(() => {});
    registry.delete(this.#container);
  }

  // -----------------------------------------------------
  // DOM events
  // -----------------------------------------------------

  #bindEvents() {
    const signal = this.#abortController.signal;

    this.#playBtn?.addEventListener('click', () => this.play(), { signal });
    this.#pauseBtn?.addEventListener('click', () => this.pause(), { signal });
    this.#muteBtn?.addEventListener('click', () => this.mute(), { signal });
    this.#unmuteBtn?.addEventListener('click', () => this.unmute(), { signal });
    this.#fullscreenBtn?.addEventListener('click', () => this.#toggleFullscreen(), { signal });
    this.#progressBar?.addEventListener('click', (e) => this.#seek(e.clientX), { signal });

    this.#progressBar?.addEventListener('touchstart', (e) => this.#handleTouch(e), { signal, passive: true });
    this.#progressBar?.addEventListener('touchmove', (e) => this.#handleTouch(e), { signal, passive: true });

    // The iframe swallows clicks, so the poster overlay doubles as the
    // click-to-play target while the video has not started yet, and a
    // transparent layer takes over once it has.
    this.#poster?.addEventListener('click', () => this.play(), { signal });
    this.#container
      .querySelector('[data-click-layer]')
      ?.addEventListener('click', () => this.#togglePlay(), { signal });

    this.#container.addEventListener('mousemove', () => this.#showControls(), { signal });
    this.#container.addEventListener('mouseleave', () => this.#hideControls(), { signal });
    this.#container.addEventListener('touchstart', () => this.#showControls(), { signal, passive: true });

    window.addEventListener('resize', () => this.#fit(), { signal });
  }

  // -----------------------------------------------------
  // Cover-fit
  //
  // The showcase containers are slightly narrower than the source files
  // (e.g. aspect-[1920/790] over a 1920x800 master), and an iframe cannot be
  // object-fit: cover. So we size the iframe to cover the container and let
  // the wrapper clip the overflow.
  // -----------------------------------------------------
  #fit() {
    const iframe = this.#stage?.querySelector('iframe');
    if (!iframe || !this.#videoAspect) return;

    const w = this.#container.clientWidth;
    const h = this.#container.clientHeight;
    if (!w || !h) return;

    const cover = w / h > this.#videoAspect
      ? { w, h: w / this.#videoAspect }
      : { w: h * this.#videoAspect, h };

    // The letterbox bars are baked into the 16:9 master, so the crop has to
    // land exactly on the content edge. A hair of overscan absorbs rounding
    // and any slight mismatch between the container aspect and the real bar
    // height, so no sliver of bar can show.
    const overscan = Number(this.#container.dataset.overscan) || 1;

    iframe.style.width = `${Math.ceil(cover.w * overscan)}px`;
    iframe.style.height = `${Math.ceil(cover.h * overscan)}px`;
  }

  // -----------------------------------------------------
  // Timing readout
  //
  // Turns "Vimeo felt sluggish" into a number. Two are worth knowing apart:
  //   - fromPlay: play() until the first frame — what the viewer waits for
  //     when the page opens or a slide is clicked.
  //   - embedAge:  how long the embed already existed at that point, i.e.
  //     how much of the setup had been done in advance.
  // Shown on screen with ?debug, always logged to the console.
  // -----------------------------------------------------
  #logFirstFrame() {
    if (this.#firstFrameLogged || !this.#embedStartedAt) return;
    this.#firstFrameLogged = true;

    const now = performance.now();
    const embedAge = Math.round(now - this.#embedStartedAt);
    const fromPlay = this.#playRequestedAt ? Math.round(now - this.#playRequestedAt) : embedAge;
    const label = this.#container.dataset.title || this.#container.dataset.vimeoId;

    console.log(
      `[vimeo] ${label}: first frame ${fromPlay} ms after play` +
      ` (embed was ${embedAge} ms old, preload variant: ${PRELOAD}, prewarmed: ${this.#prewarmed})`
    );

    const readout = this.#container.querySelector('[data-timing]');
    if (readout) readout.textContent = `${fromPlay} ms to first frame`;
  }

  #toggleFullscreen() {
    this.ensureLoaded()
      .then((p) => p.getFullscreen().then((isFs) => (isFs ? p.exitFullscreen() : p.requestFullscreen())))
      .catch((e) => console.log('Fullscreen unavailable:', e?.message || e));
  }

  #seek(clientX) {
    if (!this.#progressTrack || !this.#duration) return;
    const rect = this.#progressTrack.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    this.ensureLoaded()
      .then((p) => p.setCurrentTime(pos * this.#duration))
      .catch(() => {});
  }

  #handleTouch(event) {
    if (!event.touches.length) return;
    this.#seek(event.touches[0].clientX);
  }

  // -----------------------------------------------------
  // UI updates
  // -----------------------------------------------------

  #updatePlayButton() {
    if (this.#isPlaying) {
      this.#playBtn?.classList.add('hidden');
      this.#pauseBtn?.classList.remove('hidden');
    } else {
      this.#playBtn?.classList.remove('hidden');
      this.#pauseBtn?.classList.add('hidden');
    }
  }

  #updateMuteButton() {
    if (this.#muted) {
      this.#muteBtn?.classList.add('hidden');
      this.#unmuteBtn?.classList.remove('hidden');
    } else {
      this.#muteBtn?.classList.remove('hidden');
      this.#unmuteBtn?.classList.add('hidden');
    }
  }

  #updateProgress(seconds) {
    if (!this.#duration) return;
    const progress = (seconds / this.#duration) * 100;
    if (this.#progressFilled) this.#progressFilled.style.width = `${progress}%`;
    if (this.#progressHandle) this.#progressHandle.style.left = `calc(${progress}%)`;
  }

  #updateTimeRemaining(seconds) {
    if (!this.#timeRemainingEl) return;
    this.#timeRemainingEl.textContent = this.#formatTime(this.#duration - seconds);
  }

  #formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  #hidePoster() {
    this.#poster?.classList.add('opacity-0', 'pointer-events-none');
  }

  showPoster() {
    this.#poster?.classList.remove('opacity-0', 'pointer-events-none');
  }

  #showSpinner() {
    this.#spinner?.classList.remove('opacity-0');
  }

  #hideSpinner() {
    this.#spinner?.classList.add('opacity-0');
  }

  #showControls() {
    this.#controls?.classList.remove('opacity-0');
    this.#controls?.classList.add('opacity-100');
    clearTimeout(this.#controlsTimeout);
  }

  #hideControls() {
    clearTimeout(this.#controlsTimeout);
    this.#controlsTimeout = setTimeout(() => {
      this.#controls?.classList.remove('opacity-100');
      this.#controls?.classList.add('opacity-0');
    }, 1000);
  }
}

// -------------------------------------------------------
// Bootstrap
//
// Instantiate the controllers straight away (cheap — no iframe yet). On
// mobile there is no swiper to orchestrate playback, so prepare each embed
// shortly before it scrolls into view; the desktop swiper drives loading
// itself via swiper-vimeo.js.
//
// How far that preparation goes follows the variant, so that the comparison
// between /vimeo and /vimeo-preload also holds on a phone: the preload
// variant buffers the opening seconds, the plain one only builds the embed.
// -------------------------------------------------------
document.querySelectorAll('[data-vimeo-player]').forEach((container) => {
  new VimeoShowcasePlayer(container);
});

// Handy while evaluating this page: inspect players from the console.
window.vimeoPlayers = registry;

if (window.innerWidth < BREAKPOINT && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const player = playerFor(entry.target);
        if (player) {
          (PRELOAD ? player.prewarm() : player.ensureLoaded()).catch(() => {});
        }
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '200px 0px' }
  );

  registry.forEach((_player, container) => observer.observe(container));
}
