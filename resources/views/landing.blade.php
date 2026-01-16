@extends('app')
@section('title', env('APP_NAME'))
@section('description', 'Marco Barberi, a classical secondo, grew up in Italy and Switzerland. He graduated from the Zurich University of the Arts and studied cinematography at the American Film Institute in Los Angeles.')
@section('content')

@php
$showcases = [
  [
    'title' => 'Barry and Me',
    'src_high' => '/video/barry-and-me.mp4',
    'src_low' => '/video/barry-and-me-720p.mp4',
    'aspect' => 'aspect-[1920/790]',
    'poster' => '/video/barry-and-me.jpg',
    'info' => 'CH / DE 2026',
    'cast' => 'Ulrich&nbsp;Tukur, Max&nbsp;Hubacher, Paco&nbsp;von&nbsp;Wyss, Alma&nbsp;Büchenbacher',
    'production' => 'Atlantis&nbsp;Pictures&nbsp;CH / MMC&nbsp;Zodiac&nbsp;DE',
    'director' => 'Markus&nbsp;Welter'
  ],
  [
    'title' => 'Viktoria',
    'src_high' => '/video/viktoria.mp4',
    'src_low' => '/video/viktoria-720p.mp4',
    'aspect' => 'aspect-[1920/790]',
    'poster' => '/video/viktoria.jpg',
    'info' => 'HU / CH 2014',
    'cast' => 'Franciska&nbsp;Farkas, Zsolt&nbsp;Nagy, Angela&nbsp;Stefanovics',
    'production' => 'Hesse&nbsp;Greutert&nbsp;Film&nbsp;CH / Proton&nbsp;HU',
    'director' => 'Men&nbsp;Lareida'
  ],
  [
    'title' => 'Jill',
    'src_high' => '/video/jill-trailer.mp4',
    'src_low' => '/video/jill-trailer-720p.mp4',
    'aspect' => 'aspect-[1920/790]',
    'poster' => '/video/jill-trailer.jpg',
    'info' => 'CH / CA 2022',
    'cast' => 'Tom&nbsp;Pelphrey, Juliet&nbsp;Rylance, Garret&nbsp;Wareing, Zackary&nbsp;Arthur',
    'production' => 'Hugofilm&nbsp;Features',
    'director' => 'Steven&nbsp;Hayes'
  ],
  [
    'title' => 'On the High Seas',
    'src_high' => '/video/on-high-seas.mp4',
    'src_low' => '/video/on-high-seas-720p.mp4',
    'aspect' => 'aspect-[1920/880]',
    'poster' => '/video/on-high-seas.jpg',
    'info' => 'CH / ES 2024',
    'cast' => 'Maud&nbsp;Wyler, Michael&nbsp;Neuenschwander, Carlos&nbsp;Bardem, Isaline&nbsp;Prévost, Nicola&nbsp;Perot, Maël&nbsp;Cordier',
    'production' => 'Alva&nbsp;Film<br>Galea&nbsp;Katz&nbsp;Filmleak',
    'director' => 'Denis&nbsp;Rabaglia'
  ]
];
@endphp

<div class="relative">

  <x-swiper.wrapper>
    @foreach($showcases as $showcase)
      <x-swiper.slide>
        <x-showcase
          title="{{ $showcase['title'] }}"
          src_high="{{ $showcase['src_high'] }}"
          src_low="{{ $showcase['src_low'] }}"
          aspect="{{ $showcase['aspect'] }}"
          poster="{{ $showcase['poster'] }}"
          info="{{ $showcase['info'] }}"
          :cast="$showcase['cast']"
          :production="$showcase['production']"
          :director="$showcase['director']" />
      </x-swiper.slide>
    @endforeach
  </x-swiper.wrapper>

  <x-showcase-controls :showcases="$showcases" />
</div>
@endsection
