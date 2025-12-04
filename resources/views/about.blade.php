@extends('app')
@section('content')
<div class="relative px-20 pb-20 lg:px-0">
  <h1 class="text-smoke text-sm lg:mb-4">
    About
  </h1>
  <div class="md:grid md:grid-cols-11">
    <div class="md:col-span-7 lg:col-span-7">
      <p class="text-lg lg:text-xl leading-[1.2]">Born in 1962, he grew up in Winterthur as the son of Italian migrant workers. He obtained a federal diploma in photography from Zurich University of the Arts. In the years that followed, he worked as a lighting technician and later as a gaffer on numerous film productions in Switzerland and abroad. To further develop his skills as an image designer and visual storyteller, he then studied for two years at the renowned American Film Institute in Los Angeles, graduating with a Master's degree in Cinematography. He has twice won the EDI for best cinematography in commissioned and advertising film productions.</p>
    </div>
    <div class="md:col-span-3 md:col-start-9 lg:col-span-3 lg:col-start-9 mt-15 md:mt-0">
      <picture>
        {{-- <source srcset="/img/" type="image/avif" media="(min-width: 1024px)">
        <source srcset="/img/" type="image/webp" media="(min-width: 1024px)">
        <source srcset="/img/" type="image/jpeg" media="(min-width: 1024px)">
        <img src="/img/" alt="Tisch" class="block w-full h-auto"> --}}
        <img src="/img/portrait-marco-barberi.jpg" width="" height="" alt="Portrait Marco Barberi" class="w-full h-auto max-w-[80%] md:max-w-none">
      </picture>
    </div>
  </div>

  <div class="mt-100 md:mt-60">
    <h2 class="text-smoke text-sm mb-12">
      Selected work
    </h2>
    <div class="flex flex-col gap-y-20 md:gap-0 md:grid md:grid-cols-11">
      <article class="md:col-span-3">
        <h3>On High Sea</h3>
        <div class="text-smoke">
          Steven Hayes / Tom Pelphrey, Juliet Rylance, Garret Wareing, Zackary Arthur / Hugofilm Features<br>CH / FR / DE 2024
        </div>
      </article>
      <article class="md:col-span-3 md:col-start-5">
        <h3>On High Sea</h3>
        <div class="text-smoke">
          Steven Hayes / Tom Pelphrey, Juliet Rylance, Garret Wareing, Zackary Arthur / Hugofilm Features<br>CH / FR / DE 2024
        </div>
      </article>
      <article class="md:col-span-3 md:col-start-9">
        <h3>On High Sea</h3>
        <div class="text-smoke">
          Steven Hayes / Tom Pelphrey, Juliet Rylance, Garret Wareing, Zackary Arthur / Hugofilm Features<br>CH / FR / DE 2024
        </div>
      </article>
    </div>
  </div>
</div>
@endsection