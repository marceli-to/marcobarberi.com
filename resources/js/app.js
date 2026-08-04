// Import order matters — vimeo-player.js registers the controllers that
// swiper.js then drives.

import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse'
import './modules/vimeo-player'
import './modules/swiper'

Alpine.plugin(collapse)

window.Alpine = Alpine
Alpine.start()
