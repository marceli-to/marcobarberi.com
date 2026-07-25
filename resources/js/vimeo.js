// -------------------------------------------------------
// Entry point for the Vimeo test page (/vimeo).
//
// Mirrors app.js but swaps the two video modules for their Vimeo
// counterparts. video-source.js is not needed: picking a rendition is exactly
// the job we are handing over to Vimeo's adaptive streaming.
//
// Import order matters — vimeo-player.js registers the controllers that
// swiper-vimeo.js then drives.
// -------------------------------------------------------

import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse'
import './modules/vimeo-player'
import './modules/swiper-vimeo'

Alpine.plugin(collapse)

window.Alpine = Alpine
Alpine.start()
