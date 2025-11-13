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
// Create or destroy swiper depending on breakpoint
// -------------------------------------------------------
function initSwiper() {
  const isDesktop = window.innerWidth >= BREAKPOINT;

  // Create swiper
  if (isDesktop && !swiper) {
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
        init: () => setTimeout(updateButtonPosition, 0),
        slideChange: updateButtonPosition,
      },
    });

    return;
  }

  // Destroy swiper
  if (!isDesktop && swiper) {
    swiper.destroy(true, true);
    swiper = null;
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
  updateButtonPosition();
}, 100);

initSwiper();
window.addEventListener('resize', onResize);
