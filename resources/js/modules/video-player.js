export class VideoPlayer {
  #container;
  #video;
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
  #isPlaying = false;
  #controlsTimeout = null;
  #abortController;

  constructor(container) {
    this.#container = container;
    this.#video = container.querySelector('[data-video]');
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

    if (!this.#video) {
      console.warn('VideoPlayer: No video element found');
      return;
    }

    this.#abortController = new AbortController();
    this.#init();
  }

  #init() {
    const initialMuted = this.#video.hasAttribute('data-muted');
    this.#video.muted = initialMuted;
    this.#updateMuteButton();
    this.#bindEvents();
  }

  #bindEvents() {
    const signal = this.#abortController.signal;

    // Video events
    this.#video.addEventListener('loadedmetadata', () => this.#onLoadedMetadata(), { signal });
    this.#video.addEventListener('timeupdate', () => this.#onTimeUpdate(), { signal });
    this.#video.addEventListener('ended', () => this.#onEnded(), { signal });
    this.#video.addEventListener('play', () => this.#onPlay(), { signal });
    this.#video.addEventListener('pause', () => this.#onPause(), { signal });
    this.#video.addEventListener('click', () => this.#togglePlay(), { signal });

    // Control events with null checks
    this.#playBtn?.addEventListener('click', () => this.play(), { signal });
    this.#pauseBtn?.addEventListener('click', () => this.pause(), { signal });
    this.#muteBtn?.addEventListener('click', () => this.mute(), { signal });
    this.#unmuteBtn?.addEventListener('click', () => this.unmute(), { signal });
    this.#fullscreenBtn?.addEventListener('click', () => this.#toggleFullscreen(), { signal });
    this.#progressBar?.addEventListener('click', (e) => this.#seek(e), { signal });

    // Touch support for progress bar
    this.#progressBar?.addEventListener('touchstart', (e) => this.#handleTouch(e), { signal, passive: true });
    this.#progressBar?.addEventListener('touchmove', (e) => this.#handleTouch(e), { signal, passive: true });

    // Mouse/touch events for controls visibility
    this.#container.addEventListener('mousemove', () => this.#showControls(), { signal });
    this.#container.addEventListener('mouseleave', () => this.#hideControls(), { signal });
    this.#container.addEventListener('touchstart', () => this.#showControls(), { signal, passive: true });
  }

  #togglePlay() {
    if (this.#video.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  play() {
    this.#video.play().catch((e) => {
      if (e.name !== 'AbortError') {
        console.warn('VideoPlayer: Playback failed', e.message);
      }
    });
  }

  pause() {
    this.#video.pause();
  }

  #onPlay() {
    this.#isPlaying = true;
    this.#updatePlayButton();
  }

  #onPause() {
    this.#isPlaying = false;
    this.#updatePlayButton();
  }

  #updatePlayButton() {
    if (this.#isPlaying) {
      this.#playBtn?.classList.add('hidden');
      this.#pauseBtn?.classList.remove('hidden');
    } else {
      this.#playBtn?.classList.remove('hidden');
      this.#pauseBtn?.classList.add('hidden');
    }
  }

  mute() {
    this.#video.muted = true;
    this.#updateMuteButton();
  }

  unmute() {
    this.#video.muted = false;
    this.#updateMuteButton();
  }

  #updateMuteButton() {
    if (this.#video.muted) {
      this.#muteBtn?.classList.add('hidden');
      this.#unmuteBtn?.classList.remove('hidden');
    } else {
      this.#muteBtn?.classList.remove('hidden');
      this.#unmuteBtn?.classList.add('hidden');
    }
  }

  #toggleFullscreen() {
    // iOS Safari uses webkitEnterFullscreen on the video element
    if (this.#video.webkitEnterFullscreen) {
      // iOS requires video to be loaded before fullscreen works
      if (this.#video.readyState < 2) {
        this.#video.load();
        this.#video.addEventListener('loadeddata', () => {
          this.#video.webkitEnterFullscreen();
          this.play();
        }, { once: true });
      } else {
        this.#video.webkitEnterFullscreen();
        this.play();
      }
      return;
    }

    // Standard Fullscreen API for other browsers
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (this.#video.requestFullscreen) {
        this.#video.requestFullscreen();
      } else if (this.#video.webkitRequestFullscreen) {
        this.#video.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  #seek(event) {
    if (!this.#progressTrack) return;
    const rect = this.#progressTrack.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    this.#video.currentTime = pos * this.#video.duration;
  }

  #handleTouch(event) {
    if (!this.#progressTrack || !event.touches.length) return;
    const touch = event.touches[0];
    const rect = this.#progressTrack.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    this.#video.currentTime = pos * this.#video.duration;
  }

  #onLoadedMetadata() {
    this.#updateTimeRemaining();
  }

  #onTimeUpdate() {
    this.#updateProgress();
    this.#updateTimeRemaining();
  }

  #onEnded() {
    this.#isPlaying = false;
    this.#updatePlayButton();
  }

  #updateProgress() {
    const progress = (this.#video.currentTime / this.#video.duration) * 100;
    if (this.#progressFilled) {
      this.#progressFilled.style.width = `${progress}%`;
    }
    if (this.#progressHandle) {
      this.#progressHandle.style.left = `calc(${progress}%)`;
    }
  }

  #updateTimeRemaining() {
    if (!this.#timeRemainingEl) return;
    const remaining = this.#video.duration - this.#video.currentTime;
    this.#timeRemainingEl.textContent = this.#formatTime(remaining);
  }

  #formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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

  destroy() {
    this.#abortController?.abort();
    clearTimeout(this.#controlsTimeout);
    this.#container.removeAttribute('tabindex');
  }
}

// Auto-initialize all video players
document.addEventListener('DOMContentLoaded', () => {
  const videoContainers = document.querySelectorAll('[data-video-player]');
  videoContainers.forEach((container) => {
    new VideoPlayer(container);
  });
});
