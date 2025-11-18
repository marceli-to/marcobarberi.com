import Swiper from 'swiper';
import { Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const BREAKPOINT = 1024;
const SWIPER_SELECTOR = '.swiper';

// Cache DOM elements once
const prevBtn = document.querySelector('.swiper-btn-prev');
const nextBtn = document.querySelector('.swiper-btn-next');

let swiper = null;

// Store original poster URLs for each video
const videoPosterMap = new Map();

// -------------------------------------------------------
// Update button positions
// -------------------------------------------------------
function updateButtonPosition() {
  if (!swiper) return;

  const activeSlide = swiper.slides[swiper.activeIndex];
  const video = activeSlide?.querySelector('video');
  if (!video) return;

  const offset = video.offsetHeight / 2;

  if (prevBtn) prevBtn.style.top = `${offset}px`;
  if (nextBtn) nextBtn.style.top = `${offset}px`;
}

// -------------------------------------------------------
// Handle video playback on slide change
// -------------------------------------------------------
function handleVideoPlayback() {
  if (!swiper) return;

  // Pause and reset all videos
  const allVideos = document.querySelectorAll('.showcase-video');
  allVideos.forEach(video => {
    video.pause();
    video.currentTime = 0; // Reset to beginning
  });

  // Play the active slide's video (use activeIndex for loop mode)
  const activeSlide = swiper.slides[swiper.activeIndex];
  const activeVideo = activeSlide?.querySelector('.showcase-video');

  if (activeVideo) {
    // Remove poster attribute on desktop to prevent it from showing
    activeVideo.removeAttribute('poster');

    // Play the video
    activeVideo.play().catch(err => {
      console.log('Autoplay prevented:', err);
    });
  }
}

// -------------------------------------------------------
// Store poster URLs before removing them
// -------------------------------------------------------
function storePosterUrls() {
  const allVideos = document.querySelectorAll('.showcase-video');
  allVideos.forEach(video => {
    const posterUrl = video.getAttribute('poster');
    if (posterUrl && !videoPosterMap.has(video)) {
      videoPosterMap.set(video, posterUrl);
    }
  });
}

// -------------------------------------------------------
// Restore poster URLs
// -------------------------------------------------------
function restorePosterUrls() {
  videoPosterMap.forEach((posterUrl, video) => {
    video.setAttribute('poster', posterUrl);
    video.pause();
    video.currentTime = 0;
  });
}

// -------------------------------------------------------
// Create or destroy swiper depending on breakpoint
// -------------------------------------------------------
function initSwiper() {
  const isDesktop = window.innerWidth >= BREAKPOINT;

  // Create swiper
  if (isDesktop && !swiper) {
    // Store poster URLs before we start removing them
    storePosterUrls();

    swiper = new Swiper(SWIPER_SELECTOR, {
      modules: [Navigation, EffectFade],
      loop: true,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      navigation: {
        nextEl: '.swiper-btn-next',
        prevEl: '.swiper-btn-prev',
      },
      on: {
        init: () => {
          // setTimeout(updateButtonPosition, 0);
          setTimeout(handleVideoPlayback, 0);
        },
        slideChange: () => {
          // updateButtonPosition();
          handleVideoPlayback();
        },
      },
    });

    return;
  }

  // Destroy swiper
  if (!isDesktop && swiper) {
    swiper.destroy(true, true);
    swiper = null;

    // Restore poster attributes on mobile
    restorePosterUrls();
  }
}

// -------------------------------------------------------
// Debounce helper
// -------------------------------------------------------
const debounce = (fn, delay = 200) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

// -------------------------------------------------------
// Init + resize listener
// -------------------------------------------------------
const onResize = debounce(() => {
  initSwiper();
  // updateButtonPosition();
}, 100);

initSwiper();
window.addEventListener('resize', onResize);
