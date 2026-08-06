// Import order matters — vimeo-player.js registers the controllers that
// swiper.js then drives.

import Alpine from 'alpinejs'
import './modules/vimeo-player'
import './modules/swiper'

window.Alpine = Alpine
Alpine.start()
