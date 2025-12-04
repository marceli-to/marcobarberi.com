<header 
  class="
    bg-white 
    h-[var(--header-h-sm)] 
    lg:h-[var(--header-h-lg)] 
    sticky 
    top-0
    z-50">

  <div 
    class="
      h-[inherit] 
      mx-auto 
      px-20 
      lg:px-50 
      max-w-[var(--max-w-container)] 
      pt-60 
      lg:pt-28">

    <div class="lg:flex lg:items-end">

      <h1 class="text-xl leading-none">
        <a href="{{ route('landing') }}" aria-label="Homepage">Marco Barberi</a>
      </h1>

      <div class="text-lg lg:grow lg:relative lg:top-4 lg:pl-44 flex justify-between">
        <div>
          <em>D.o.P. / S.C.S.</em>
        </div>
        <div class="text-smoke flex gap-x-10 lg:gap-x-40">
          <a 
            href="{{ route('about') }}" 
            aria-label="About"
            class="hover:text-black transition-colors {{ request()->routeIs('about') ? 'text-black' : '' }}">
            About
          </a>
          <button 
            x-on:click="contact = !contact" 
            x-show="!contact"
            class="hover:text-black transition-colors cursor-pointer lg:!block"
            :class="{ 'text-black' : contact}">
            Contact
          </button>
        </div>
      </div>

    </div>

  </div>

</header>

<x-layout.nav />