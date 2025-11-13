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
        cast="Tom&nbsp;Pelphrey, Juliet&nbsp;Rylance, Garret&nbsp;Wareing, Zackary&nbsp;Arthur"
        production="Hugofilm&nbsp;Features"
        director="Steven&nbsp;Hayes" />
    </x-swiper.slide>

    <x-swiper.slide>
      <x-showcase
        title="An Extraordinary Long Title"
        src="/video/on-high-sea.mp4"
        poster="/video/on-high-sea.jpg"
        info="CH / CA 2022"
        cast="Tom&nbsp;Pelphrey, Juliet&nbsp;Rylance, Garret&nbsp;Wareing, Zackary&nbsp;Arthur"
        production="Hugofilm&nbsp;Features"
        director="Steven&nbsp;Hayes" />
    </x-swiper.slide>
    
  </x-swiper.wrapper>
</div>
@endsection
