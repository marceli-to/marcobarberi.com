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
        Marco Barberi
      </h1>

      <div class="lg:grow lg:relative lg:top-4 lg:pl-44 flex justify-between">
        <div>
          <em>D.o.P. / S.C.S.</em>
        </div>
        <div>
          <button 
            x-on:click="contact = !contact" 
            x-show="!contact"
            class="text-smoke cursor-pointer lg:!block">
            Contact
          </button>
        </div>
      </div>

    </div>

  </div>

</header>

<x-layout.nav />