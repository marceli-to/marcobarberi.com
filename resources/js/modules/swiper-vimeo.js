// -------------------------------------------------------
// Swiper for the Vimeo test page
//
// Same behaviour as modules/swiper.js, but playback is orchestrated through
// the Vimeo Player SDK instead of native <video> elements. Because the embeds
// are created lazily, this module also decides *when* to create them:
// the active slide loads immediately, the next one is warmed up right after,
// and the rest wait until they are actually shown.
// -------------------------------------------------------

import Swiper from 'swiper';
import { Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import { playerFor, PRELOAD } from './vimeo-player';

const BREAKPOINT = 1024;
const SWIPER_SELECTOR = '.swiper';

let swiper = null;

// -------------------------------------------------------
// Update Alpine.js slide index
// -------------------------------------------------------
function updateAlpineSlideIndex(index) {
  const alpineEl = document.querySelector('[x-data*="activeSlide"]');
  if (alpineEl && window.Alpine) {
    Alpine.store('showcase', { activeSlide: index });
    const alpineData = Alpine.$data(alpineEl);
    if (alpineData) {
      alpineData.activeSlide = index;
    }
  }
}

// -------------------------------------------------------
// Resolve the player controller sitting inside a swiper slide
// -------------------------------------------------------
function playerInSlide(slide) {
  const container = slide?.querySelector('[data-vimeo-player]');
  return container ? playerFor(container) : null;
}

// -------------------------------------------------------
// Handle playback on slide change
// -------------------------------------------------------
function handleVideoPlayback() {
  if (!swiper) return;

  const active = playerInSlide(swiper.slides[swiper.activeIndex]);

  // Pause and rewind every player that has actually been created. Untouched
  // slides have no embed yet, so there is nothing to stop. The active one is
  // skipped on purpose: resetting it and starting it again in the same tick
  // races two async SDK commands against each other.
  swiper.slides.forEach((slide) => {
    const player = playerInSlide(slide);
    if (player && player !== active && player.isLoaded) player.reset();
  });

  if (!active) return;

  // Muted autoplay: browsers allow it, and the poster stays up until the
  // first frame arrives so there is never an empty black box.
  active.play().then(() => prewarmNext());
}

// -------------------------------------------------------
// Prepare the next slide while the current one plays. This is the one thing
// the two test variants differ in:
//
//   /vimeo          ensureLoaded() — iframe, SDK and stream manifest only.
//                   Vimeo decides on its own whether to buffer anything.
//   /vimeo-preload  prewarm()      — additionally pushes the opening seconds
//                   into the buffer, so switching starts near-instantly.
//
// Either way only the *next* slide, and only once the active one is already
// playing: preparing everything up front would put four players on the
// network at the same time and slow down the one the viewer is looking at.
// -------------------------------------------------------
function prewarmNext() {
  if (!swiper) return;
  const nextIndex = (swiper.activeIndex + 1) % swiper.slides.length;
  const next = playerInSlide(swiper.slides[nextIndex]);
  if (!next) return;
  if (PRELOAD) {
    next.prewarm().catch(() => {});
  } else if (!next.isLoaded) {
    next.ensureLoaded().catch(() => {});
  }
}

// -------------------------------------------------------
// Create or destroy swiper depending on breakpoint
// -------------------------------------------------------
function initSwiper() {
  const isDesktop = window.innerWidth >= BREAKPOINT;

  if (isDesktop && !swiper) {
    swiper = new Swiper(SWIPER_SELECTOR, {
      modules: [Navigation, EffectFade],
      loop: true,
      effect: 'fade',
      autoHeight: true,
      fadeEffect: {
        crossFade: true,
      },
      navigation: {
        nextEl: '.swiper-btn-next',
        prevEl: '.swiper-btn-prev',
      },
      on: {
        init: (swiperInstance) => {
          setTimeout(handleVideoPlayback, 0);
          updateAlpineSlideIndex(swiperInstance.realIndex);
        },
        slideChange: (swiperInstance) => {
          handleVideoPlayback();
          updateAlpineSlideIndex(swiperInstance.realIndex);
        },
      },
    });

    return;
  }

  if (!isDesktop && swiper) {
    swiper.destroy(true, true);
    swiper = null;

    // Back to the stacked mobile layout: stop everything and show posters
    // again so nothing keeps streaming off screen.
    document.querySelectorAll('[data-vimeo-player]').forEach((container) => {
      const player = playerFor(container);
      if (player?.isLoaded) {
        player.reset();
        player.showPoster();
      }
    });
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
}, 100);

initSwiper();
window.addEventListener('resize', onResize);
