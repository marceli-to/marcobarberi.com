// -------------------------------------------------------
// Responsive video source selection
//
// The `media` attribute on <source> elements is ignored inside <video> by all
// modern browsers (it only works within <picture>). Without JS, every device
// would load the first source — the large desktop file — which stalls on
// mobile connections. We therefore assign the correct source ourselves based
// on the viewport width, matching the breakpoint used by the swiper.
// -------------------------------------------------------

const BREAKPOINT = 1024;

function selectSources() {
  const isDesktop = window.innerWidth >= BREAKPOINT;

  document.querySelectorAll('video[data-src-high]').forEach((video) => {
    const src = isDesktop ? video.dataset.srcHigh : video.dataset.srcLow;

    // Nothing to do if the desired source is missing or already applied.
    if (!src || video.getAttribute('src') === src) return;

    video.setAttribute('src', src);
    video.load();
  });
}

// Debounce helper (kept local so this module has no dependencies).
function debounce(fn, delay = 200) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Run immediately (module scripts are deferred, so the DOM is ready) and
// before the swiper module attempts to autoplay the active desktop slide.
selectSources();

// Re-evaluate when the viewport crosses the breakpoint. selectSources() is a
// no-op when the source is unchanged, so same-breakpoint resizes cost nothing.
window.addEventListener('resize', debounce(selectSources, 100));
