@extends('app')
@section('title', 'Contact')
@section('description', 'Contact details for Marco Barberi (D.o.P. / S.C.S.) and representation info.')
@section('content')
<div class="relative px-20 pb-20 lg:px-0">
  <h1 class="text-smoke text-sm lg:mb-4">
    Contact
  </h1>
  <div class="md:grid md:grid-cols-2 md:gap-x-20 lg:gap-x-40 text-lg lg:text-xl leading-[1.2]">
    <div>
      <div class="mb-20">
        <div>
          <em>D.o.P. / S.C.S.</em>
        </div>
        <div>
          Marco Barberi
        </div>
      </div>
      <div>
        <a 
          href="https://www.imdb.com/name/nm0053510/?ref_=ext_shr_lnk" 
          target="_blank" 
          rel="noreferrer,noopener"
          class="block no-underline hover:underline underline-offset-1 decoration-1">
          IMDB
        </a>
        <a 
          href="mailto:icanplaybetterbass@me.com"
          class="block no-underline hover:underline underline-offset-1 decoration-1">
          icanplaybetterbass@me.com
        </a>
        <span class="block">
          +41 76 377 21 97
        </span>
      </div>
    </div>
    <div class="mt-40 md:mt-0">
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
          class="block no-underline hover:underline underline-offset-1 decoration-1"
          aria-label="saridabossoni.com"
          rel="noopener noreferrer"
          target="_blank">
          saridabossoni.com
        </a>
        <a 
          href="mailto:welcome@saridabossoni.com"
          class="block no-underline hover:underline underline-offset-1 decoration-1"
          aria-label="welcome@saridabossoni.com">
          welcome@saridabossoni.com
        </a>
        <div>
          +41 79 279 11 99
        </div>
      </div>
    </div>
  </div>
</div>
@endsection
