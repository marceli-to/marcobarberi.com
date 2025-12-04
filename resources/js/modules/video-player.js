export class VideoPlayer {
  constructor(container) {
    this.container = container;
    this.video = container.querySelector('.video-element');
    this.playBtn = container.querySelector('.play-btn');
    this.pauseBtn = container.querySelector('.pause-btn');
    this.muteBtn = container.querySelector('.mute-btn');
    this.unmuteBtn = container.querySelector('.unmute-btn');
    this.fullscreenBtn = container.querySelector('.fullscreen-btn');
    this.progressBar = container.querySelector('.progress-bar');
    this.progressFilled = container.querySelector('.progress-filled');
    this.progressHandle = container.querySelector('.progress-handle');
    this.timeRemainingEl = container.querySelector('.time-remaining');
    this.controls = container.querySelector('.video-controls');

    this.isPlaying = false;
    this.controlsTimeout = null;
    this.initialMuted = this.video.hasAttribute('data-muted');

    this.init();
  }

  init() {
    this.video.muted = this.initialMuted;
    this.updateMuteButton();
    this.bindEvents();
  }

  bindEvents() {
    // Video events
    this.video.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
    this.video.addEventListener('timeupdate', () => this.onTimeUpdate());
    this.video.addEventListener('ended', () => this.onEnded());
    this.video.addEventListener('play', () => this.onPlay());
    this.video.addEventListener('pause', () => this.onPause());
    this.video.addEventListener('click', () => this.togglePlay());

    // Control events
    this.playBtn.addEventListener('click', () => this.play());
    this.pauseBtn.addEventListener('click', () => this.pause());
    this.muteBtn.addEventListener('click', () => this.mute());
    this.unmuteBtn.addEventListener('click', () => this.unmute());
    this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    this.progressBar.addEventListener('click', (e) => this.seek(e));

    // Mouse events for controls visibility
    this.container.addEventListener('mousemove', () => this.showControls());
    this.container.addEventListener('mouseleave', () => this.hideControls());
  }

  togglePlay() {
    if (this.video.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  play() {
    this.video.play();
  }

  pause() {
    this.video.pause();
  }

  onPlay() {
    this.isPlaying = true;
    this.updatePlayButton();
  }

  onPause() {
    this.isPlaying = false;
    this.updatePlayButton();
  }

  updatePlayButton() {
    if (this.isPlaying) {
      this.playBtn.classList.add('hidden');
      this.pauseBtn.classList.remove('hidden');
    } else {
      this.playBtn.classList.remove('hidden');
      this.pauseBtn.classList.add('hidden');
    }
  }

  mute() {
    this.video.muted = true;
    this.updateMuteButton();
  }

  unmute() {
    this.video.muted = false;
    this.updateMuteButton();
  }

  updateMuteButton() {
    if (this.video.muted) {
      this.muteBtn.classList.add('hidden');
      this.unmuteBtn.classList.remove('hidden');
    } else {
      this.muteBtn.classList.remove('hidden');
      this.unmuteBtn.classList.add('hidden');
    }
  }

  toggleFullscreen() {
    const video = this.video;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  seek(event) {
    const progressBarInner = this.progressBar.querySelector('.relative.h-2');
    const rect = progressBarInner.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    this.video.currentTime = pos * this.video.duration;
  }

  onLoadedMetadata() {
    this.updateTimeRemaining();
  }

  onTimeUpdate() {
    this.updateProgress();
    this.updateTimeRemaining();
  }

  onEnded() {
    this.isPlaying = false;
    this.updatePlayButton();
  }

  updateProgress() {
    const progress = (this.video.currentTime / this.video.duration) * 100;
    this.progressFilled.style.width = `${progress}%`;
    this.progressHandle.style.left = `calc(${progress}%)`;
  }

  updateTimeRemaining() {
    const remaining = this.video.duration - this.video.currentTime;
    this.timeRemainingEl.textContent = this.formatTime(remaining);
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  showControls() {
    this.controls.classList.remove('opacity-0');
    this.controls.classList.add('opacity-100');
    clearTimeout(this.controlsTimeout);
  }

  hideControls() {
    clearTimeout(this.controlsTimeout);
    this.controlsTimeout = setTimeout(() => {
      this.controls.classList.remove('opacity-100');
      this.controls.classList.add('opacity-0');
    }, 1000);
  }

  hideControlsImmediate() {
    this.controls.classList.remove('opacity-100');
    this.controls.classList.add('opacity-0');
  }
}

// Auto-initialize all video players
document.addEventListener('DOMContentLoaded', () => {
  const videoContainers = document.querySelectorAll('.video-player-container');
  videoContainers.forEach(container => {
    new VideoPlayer(container);
  });
});
