<nav 
  x-cloak
  x-show="contact"
  class="
    bg-white
    fixed
    z-50
    text-md 
    px-20 
    lg:px-50
    w-full
    h-[calc(100dvh_-_var(--header-h-sm))]
    lg:h-[calc(100dvh_-_var(--header-h-lg))]
    top-[var(--header-h-sm)] lg:top-[var(--header-h-lg)]
    lg:right-[max(calc((100vw_-_var(--max-w-container))_/2),0px)]
    lg:w-[calc(var(--max-w-container)/2)]
    lg:max-w-[var(--max-w-nav-lg)]">

  <button 
    x-on:click="contact = !contact"
    class="w-26 h-26 cursor-pointer absolute -top-30 lg:top-0 right-20">
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
      <path d="M0.353598 0.353913L24.7375 24.7378M24.7375 0.353546L0.353577 24.7374" stroke="#707070"/>
    </svg>
  </button>
  
  <div class="mb-20 lg:mt-30">
    <div>
      <em>D.o.P. / S.C.S.</em>
    </div>
    <div>
      Marco Barberi
    </div>
  </div>
  <div class="mb-74">
    <div>
      IMDB
    </div>
    <div>
      icanplaybetterbass@me.com
    </div>
    <div>
      +41 76 377 21 97
    </div>
  </div>
  <div class="mb-16">
    <div>
      <em>Agency for Directors of Photography</em>
    </div>
    <div>
      Sarida Bossoni
    </div>
  </div>
  <div>
    <div>
      saridabossoni.com
    </div>
    <div>
      welcome@saridabossoni.com
    </div>
    <div>
      +41 79 279 11 99
    </div>
  </div>
</nav>