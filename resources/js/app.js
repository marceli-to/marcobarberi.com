import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse'
import './modules/video-source'
import './modules/swiper'
import './modules/video-player'

Alpine.plugin(collapse)

window.Alpine = Alpine
Alpine.start()
