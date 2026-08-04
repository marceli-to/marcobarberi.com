@extends('app')
@section('title', env('APP_NAME'))
@section('description', 'Marco Barberi, a classical secondo, grew up in Italy and Switzerland. He graduated from the Zurich University of the Arts and studied cinematography at the American Film Institute in Los Angeles.')

@section('meta')
{{-- Get the TLS handshakes to Vimeo out of the way before the first embed is
     built; the player, its assets and the video segments live on three hosts. --}}
<link rel="preconnect" href="https://player.vimeo.com" crossorigin>
<link rel="preconnect" href="https://f.vimeocdn.com" crossorigin>
<link rel="preconnect" href="https://i.vimeocdn.com" crossorigin>
<link rel="dns-prefetch" href="https://vod-adaptive-ak.vimeocdn.com">
@endsection

@section('content')

@php
// ---------------------------------------------------------------------------
// The films stream from Vimeo (adaptive HLS), not from self-hosted MP4s.
//
// To add a film: paste its Vimeo ID below. For a public video the ID is the
// number in https://vimeo.com/1211661544. For an *unlisted* video the URL
// looks like https://vimeo.com/1211661544/abc123def — then the second part
// goes into 'vimeo_hash'. Entries without an ID are skipped automatically.
//
// 'aspect' is the ratio the film is shown in. The Vimeo masters are 16:9 with
// the letterbox bars baked in, and the player crops to this ratio to remove
// them.
// ---------------------------------------------------------------------------
$showcases = [
  [
    'title' => 'Jill',
    'vimeo_id' => '1211658382',
    'vimeo_hash' => '',
    'aspect' => 'aspect-[1920/790]',
    'poster' => '/video/jill-trailer.jpg',
    'info' => 'CH / CA 2022',
    'cast' => 'Tom&nbsp;Pelphrey, Juliet&nbsp;Rylance, Garret&nbsp;Wareing, Zackary&nbsp;Arthur',
    'production' => 'Hugofilm&nbsp;Features',
    'director' => 'Steven&nbsp;Hayes'
  ],
  [
    'title' => 'On the High Seas',
    'vimeo_id' => '1211661544',
    'vimeo_hash' => '',
    'aspect' => 'aspect-[1920/880]',
    'poster' => '/video/on-high-seas.jpg',
    'info' => 'CH / ES 2024',
    'cast' => 'Maud&nbsp;Wyler, Michael&nbsp;Neuenschwander, Carlos&nbsp;Bardem, Isaline&nbsp;Prévost, Nicola&nbsp;Perot, Maël&nbsp;Cordier',
    'production' => 'Alva&nbsp;Film<br>Galea&nbsp;Katz&nbsp;Filmleak',
    'director' => 'Denis&nbsp;Rabaglia'
  ],
  [
    'title' => 'Barry and Me',
    'vimeo_id' => '1214195226',
    'vimeo_hash' => '',
    'aspect' => 'aspect-[1920/790]',
    'poster' => '/video/barry-and-me.jpg',
    'info' => 'CH / DE 2026',
    'cast' => 'Ulrich&nbsp;Tukur, Max&nbsp;Hubacher, Paco&nbsp;von&nbsp;Wyss, Alma&nbsp;Büchenbacher',
    'production' => 'Atlantis&nbsp;Pictures&nbsp;CH / MMC&nbsp;Zodiac&nbsp;DE',
    'director' => 'Markus&nbsp;Welter'
  ],
  [
    'title' => 'Viktoria',
    'vimeo_id' => '1214193782',
    'vimeo_hash' => '',
    'aspect' => 'aspect-[1920/790]',
    'poster' => '/video/viktoria.jpg',
    'info' => 'HU / CH 2014',
    'cast' => 'Franciska&nbsp;Farkas, Zsolt&nbsp;Nagy, Angela&nbsp;Stefanovics',
    'production' => 'Hesse&nbsp;Greutert&nbsp;Film&nbsp;CH / Proton&nbsp;HU',
    'director' => 'Men&nbsp;Lareida'
  ]
];

// A film without a Vimeo ID has nothing to play, so it is left out.
$showcases = array_values(array_filter($showcases, fn ($s) => $s['vimeo_id'] !== ''));
@endphp

<div class="relative">

  @if(count($showcases))
    <x-swiper.wrapper>
      @foreach($showcases as $showcase)
        <x-swiper.slide>
          <x-showcase
            title="{{ $showcase['title'] }}"
            vimeo_id="{{ $showcase['vimeo_id'] }}"
            vimeo_hash="{{ $showcase['vimeo_hash'] }}"
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
  @endif

</div>
@endsection
