@extends('app')
@section('content')

<div class="relative">

  <x-swiper.wrapper>

    <x-swiper.slide>
      <x-showcase
        title="Jill"
        src="/video/jill-trailer.mp4"
        poster="/video/jill-trailer.jpg"
        info="CH / CA 2022"
        :data="[
          ['label' => 'Cast', 'text' => 'Tom&nbsp;Pelphrey, Juliet&nbsp;Rylance, Garret&nbsp;Wareing, Zackary&nbsp;Arthur'],
          ['label' => 'Production', 'text' => 'Hugofilm Features'],
          ['label' => 'Director', 'text' => 'Steven Hayes'],
        ]" />
    </x-swiper.slide>

    <x-swiper.slide>
      <x-showcase
        title="An Extraordinary Long Title"
        src="/video/on-high-sea.mp4"
        poster="/video/on-high-sea.jpg"
        info="CH / CA 2022"
        :data="[
          ['label' => 'Cast', 'text' => 'Tom&nbsp;Pelphrey, Juliet&nbsp;Rylance, Garret&nbsp;Wareing, Zackary&nbsp;Arthur'],
          ['label' => 'Production', 'text' => 'Hugofilm Features'],
          ['label' => 'Director', 'text' => 'Steven Hayes'],
        ]" />
    </x-swiper.slide>
    
  </x-swiper.wrapper>
</div>
@endsection
