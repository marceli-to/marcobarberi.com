// -------------------------------------------------------
// Vimeo-backed showcase player
//
// Drives a Vimeo embed through the official Player SDK, behind the site's own
// control bar — the embed itself runs with controls:false.
//
// Why Vimeo: the films used to be self-hosted MP4s of 70-220 MB, delivered as
// a progressive download, so the browser had to pull the whole file through a
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

export function playerFor(container) {
  return registry.get(container);
}

export function allPlayers() {
  return [...registry.values()];
}

// -------------------------------------------------------
// Sound
//
// The films are meant to run with sound, from the first one on. Browsers do
// not simply grant that — but they do not flatly forbid it either:
//
//   Chrome allows unmuted autoplay once the domain has enough "media
//   engagement" (a score built from earlier visits where video was watched
//   with sound), and always on a page the viewer has already interacted with.
//   Safari has a per-site auto-play setting that can allow it. Firefox has a
//   per-site permission. On a fresh browser, everybody refuses.
//
// So instead of assuming the worst, every start is *attempted with sound* and
// only falls back to muted when the browser actually refuses (see
// #startPlayback). The refusal is remembered globally, so the other films do
// not each pay for the same rejection, and the first click, tap or keypress
// lifts it again — from that moment the sound is on everywhere.
//
// Two flags, because "the viewer wants no sound" and "the browser will not
// allow sound yet" have to be told apart:
// -------------------------------------------------------
let soundWanted = true;    // false only once the viewer hits mute
let soundBlocked = false;  // true while the browser refuses unmuted playback
let soundProved = false;   // a film has actually run with sound at least once

const soundIsOn = () => soundWanted && !soundBlocked;

function refreshSound() {
  registry.forEach((player) => player.applySound());
}

/** The viewer worked the mute button — a gesture, so nothing is blocked. */
function chooseSound(on) {
  soundWanted = on;
  soundBlocked = false;
  refreshSound();
}

/**
 * The browser refused unmuted playback; carry on muted for now.
 *
 * Once sound has actually come out of a film, the page plainly has the
 * browser's blessing and a later refusal cannot be genuine — reading one as
 * genuine would silence the remaining films for no reason.
 */
function markSoundBlocked() {
  if (soundBlocked || soundProved) return;
  soundBlocked = true;
  refreshSound();
}

/** A film really did play with sound — the permission question is settled. */
function markSoundProved() {
  soundProved = true;
}

/** A real interaction lifts the block — unless the viewer chose silence. */
function unblockSound() {
  if (!soundBlocked) return;
  soundBlocked = false;
  refreshSound();
}

// Capture phase, so we are ahead of the play/pause handlers on the video
// itself — the sound is already on by the time playback starts.
//
// This stays armed for the whole visit rather than firing once: a block can
// be raised at any point, and every later interaction is another chance to
// lift it. unblockSound() is a no-op while nothing is blocked, and a viewer
// who muted deliberately is not affected either way.
//
// The click surface over the film is left out: a click there is handled by the
// player, which spends the first one on the sound instead of pausing.
function armSoundOnGesture() {
  const enable = (event) => {
    if (event.target?.closest?.('[data-click-layer]')) return;
    unblockSound();
  };

  ['pointerdown', 'touchstart', 'keydown'].forEach((type) => {
    document.addEventListener(type, enable, { capture: true, passive: true });
  });
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
  #soundHint;

  #player = null;
  #loading = null;
  #isPlaying = false;
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
    this.#soundHint = container.querySelector('[data-sound-hint]');

    if (!this.#stage || !container.dataset.vimeoId) {
      console.warn('VimeoShowcasePlayer: missing stage or vimeo id', container);
      return;
    }

    this.#abortController = new AbortController();
    this.#updateMuteButton();
    this.#updateSoundHint();
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
      muted: true,          // real state is set per start, see #startPlayback
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
      // Either way the forced mute above was ours, not the viewer's, so it is
      // undone — but only once the player is parked, or the buffering run
      // would be audible over the film the viewer is actually watching.
      //
      // The viewer can arrive at any point of that parking sequence, so every
      // step re-checks: a pause or a rewind landing on top of a real play()
      // would both stop the film and look like a refused start.
      if (this.#prewarmAborted) {
        this.applySound();
      } else {
        this.#player.pause()
          .then(() => (this.#prewarmAborted ? null : this.#player.setCurrentTime(0)))
          .then(() => this.applySound())
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
      this.#updateSoundHint();
    });

    p.on('pause', () => {
      if (this.#prewarming) return;
      this.#isPlaying = false;
      this.#updatePlayButton();
      this.#updateSoundHint();
    });

    p.on('ended', () => {
      this.#isPlaying = false;
      this.#updatePlayButton();
      this.#updateSoundHint();
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

    // A refused play is expected, not a fault — #startPlayback answers it by
    // falling back to muted. Only real errors are worth the console.
    p.on('error', (e) => {
      if (e?.name === 'NotAllowedError') return;
      console.warn('Vimeo player error', e);
    });
  }

  // -----------------------------------------------------
  // Public control surface (mirrors VideoPlayer)
  // -----------------------------------------------------

  #togglePlay() {
    return this.#isPlaying ? this.pause() : this.play();
  }

  /**
   * Click on the film itself. A silently autoplaying film is waiting for the
   * one interaction the browser needs before it may make a sound, so that
   * first click is spent on the sound — pausing on it would read as a
   * misfire. Every click after that toggles playback as before.
   */
  #clickBody() {
    if (this.#isPlaying && soundBlocked && soundWanted) {
      unblockSound();
      return;
    }
    this.#togglePlay();
  }

  play() {
    this.#playRequestedAt = performance.now();

    // A real play request always outranks an in-flight prewarm: let UI events
    // through again immediately, and stop the prewarm from pausing us.
    this.#prewarmAborted = true;
    this.#prewarming = false;

    return this.ensureLoaded()
      .then((p) => this.#startPlayback(p))
      .catch((e) => {
        // Autoplay rejections are expected when the browser blocks playback.
        if (e?.name !== 'AbortError') {
          console.log('Vimeo playback prevented:', e?.message || e);
        }
      });
  }

  /**
   * Start playback with sound where the browser permits it.
   *
   * The sound has to be set *before* play(): the autoplay policy is judged on
   * the state at that moment, so starting muted and unmuting afterwards would
   * never get sound on the opening film, even in a browser that would have
   * allowed it.
   *
   * A refusal shows up in three different guises, and all of them have to be
   * caught or the control bar ends up claiming sound over a silent film:
   *
   *   - a NotAllowedError from play(),
   *   - a player still paused a moment later, in browsers that quietly do
   *     nothing,
   *   - and the sneaky one: Vimeo answers a refused unmuted start by muting
   *     *itself* and playing anyway, so play() resolves perfectly happily
   *     over a silent film. A resolved promise is therefore no proof of
   *     sound — only the player's own muted flag is (see #confirmSound).
   *
   * Any other rejection means the start was interrupted rather than refused,
   * almost always by our own prewarm parking the film at the very moment the
   * viewer arrived on its slide. That must not cost the sound: it is simply
   * started again.
   */
  async #startPlayback(p) {
    const withSound = soundIsOn();

    await p.setMuted(!withSound).catch(() => {});

    if (!withSound) return p.play();

    const outcome = await Promise.race([
      p.play().then(
        () => 'played',
        (e) => (e?.name === 'NotAllowedError' ? 'blocked' : 'interrupted')
      ),
      // The losing branch must resolve rather than throw, or its rejection
      // would surface as an unhandled one after the race is decided.
      wait(2500).then(() => p.getPaused()).then((paused) => (paused ? 'blocked' : 'played'), () => 'played'),
    ]);

    if (outcome === 'played') return this.#confirmSound(p);

    if (outcome === 'interrupted') {
      return p.play().then(() => this.#confirmSound(p), () => {});
    }

    markSoundBlocked();
    await p.setMuted(true).catch(() => {});
    return p.play();
  }

  /**
   * Playback is running — but with sound? Ask the player instead of assuming,
   * because a silent film that reports itself as playing is exactly how the
   * refusal arrives.
   */
  async #confirmSound(p) {
    const muted = await p.getMuted().catch(() => null);

    if (muted === false) return markSoundProved();
    if (muted === true) markSoundBlocked();
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

  /**
   * Mute state is global, not per film — the viewer sets it once and it holds
   * for every slide, including the ones whose embed does not exist yet.
   */
  mute() {
    chooseSound(false);
  }

  unmute() {
    chooseSound(true);
  }

  /** Push the global sound state into this embed and its controls. */
  applySound() {
    this.#updateMuteButton();
    this.#updateSoundHint();

    // While prewarming, the embed is deliberately muted and running off
    // screen; its own finally block applies the sound once it is parked.
    if (!this.#player || this.#prewarming) return;

    this.#player.setMuted(!soundIsOn())
      .then(() => {
        // Safari can stop playback when a video is unmuted from script.
        // Nudging it back is a no-op everywhere else.
        if (soundIsOn() && this.#isPlaying) return this.#player.play();
      })
      .catch(() => {});
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

    // The invitation sits over the film, so its click must not reach the
    // play/pause layer underneath.
    this.#soundHint?.addEventListener('click', (e) => {
      e.stopPropagation();
      unblockSound();
    }, { signal });
    this.#progressBar?.addEventListener('click', (e) => this.#seek(e.clientX), { signal });

    this.#progressBar?.addEventListener('touchstart', (e) => this.#handleTouch(e), { signal, passive: true });
    this.#progressBar?.addEventListener('touchmove', (e) => this.#handleTouch(e), { signal, passive: true });

    // The iframe swallows clicks, so the poster overlay doubles as the
    // click-to-play target while the video has not started yet, and a
    // transparent layer takes over once it has.
    // Starting a film by hand is the interaction the browser was waiting for,
    // so the sound may come on with it.
    this.#poster?.addEventListener('click', () => {
      unblockSound();
      this.play();
    }, { signal });

    this.#container
      .querySelector('[data-click-layer]')
      ?.addEventListener('click', () => this.#clickBody(), { signal });

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
      ` (embed was ${embedAge} ms old, prewarmed: ${this.#prewarmed})`
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

  /**
   * The invitation to switch the sound on only makes sense while a film is
   * actually running silently against the viewer's wish — never on a paused
   * film, and never once the sound is on or deliberately off.
   */
  #updateSoundHint() {
    if (!this.#soundHint) return;

    const invite = this.#isPlaying && soundBlocked && soundWanted;
    this.#soundHint.classList.toggle('opacity-0', !invite);
    this.#soundHint.classList.toggle('pointer-events-none', !invite);
  }

  #updateMuteButton() {
    if (!soundIsOn()) {
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
// shortly before it scrolls into view — prewarm(), i.e. buffer the opening
// seconds, matching what the desktop swiper does via swiper.js.
// -------------------------------------------------------
document.querySelectorAll('[data-vimeo-player]').forEach((container) => {
  new VimeoShowcasePlayer(container);
});

armSoundOnGesture();

// Handy for debugging: inspect players and the sound state from the console.
window.vimeoPlayers = registry;
window.vimeoSound = () => ({ soundWanted, soundBlocked, soundProved, on: soundIsOn() });

if (window.innerWidth < BREAKPOINT && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const player = playerFor(entry.target);
        if (player) player.prewarm().catch(() => {});
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '200px 0px' }
  );

  registry.forEach((_player, container) => observer.observe(container));
}
