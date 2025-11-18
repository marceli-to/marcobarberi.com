<nav 
  x-cloak
  x-show="contact"
  x-transition:enter="transition ease-out duration-300"
  x-transition:enter-start="opacity-0"
  x-transition:enter-end="opacity-100"
  x-transition:leave="transition ease-in duration-0"
  x-transition:leave-start="opacity-100"
  x-transition:leave-end="opacity-0"
  class="
    bg-white
    fixed
    z-50
    text-md 
    px-20 
    lg:pr-34
    lg:pl-38
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
    <x-icons.cross />
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
    <span class="block">
      IMDB
    </span>
    <a 
      href="mailto:icanplaybetterbass@me.com"
      class="no-underline hover:underline underline-offset-1 decoration-1">
      icanplaybetterbass@me.com
    </a>
    <span class="block">
      +41 76 377 21 97
    </span>
  </div>
  <div class="mb-16">
    <span class="block">
      <em>Agency for Directors of Photography</em>
    </span>
    <span class="block">
      Sarida Bossoni
    </span>
  </div>
  <div>
    <a 
      href="https://saridabossoni.com"
      class="no-underline hover:underline underline-offset-1 decoration-1"
      aria-label="saridabossoni.com"
      rel="noopener noreferrer"
      target="_blank">
      saridabossoni.com
    </a>
    <a 
      href="mailto:welcome@saridabossoni.com"
      class="no-underline hover:underline underline-offset-1 decoration-1"
      aria-label="welcome@saridabossoni.com">
      welcome@saridabossoni.com
    </a>
    <div>
      +41 79 279 11 99
    </div>
  </div>
</nav>