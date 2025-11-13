import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const BREAKPOINT = 1024;
const SWIPER_SELECTOR = '.swiper';
let swiper = null;

function initSwiper() {
  const isDesktop = window.innerWidth >= BREAKPOINT;

  // Create if needed
  if (isDesktop && !swiper) {
    swiper = new Swiper(SWIPER_SELECTOR, {
      modules: [Navigation],
      loop: true,
      navigation: {
        nextEl: '.swiper-btn-next',
        prevEl: '.swiper-btn-prev',
      },
    });
    return;
  }

  // Destroy if needed
  if (!isDesktop && swiper) {
    swiper.destroy(true, true);
    swiper = null;
  }
}

// --- Debounce helper ---
function debounce(fn, delay = 200) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Initialize on load
initSwiper();

// Re-initialize on resize (debounced)
window.addEventListener('resize', debounce(initSwiper, 150));
