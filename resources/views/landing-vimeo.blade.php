{{--
  Serves both Vimeo test variants. The routes decide which one via $preload:

    /vimeo           $preload = false  — next film's player is built, no data
    /vimeo-preload   $preload = true   — next film's opening is buffered too

  One view on purpose, so the showcase list below stays in a single place.
--}}
@extends('app-vimeo')
@section('title', env('APP_NAME') . ' — Vimeo Test ' . ($preload ? '(mit Vorladen)' : '(ohne Vorladen)'))
@section('description', 'Testversion mit Vimeo — nicht die öffentliche Seite.')
@section('content')

@php
// ---------------------------------------------------------------------------
// VIMEO TEST PAGE
//
// Same showcases as landing.blade.php, but the films stream from Vimeo
// instead of the self-hosted MP4s (70-220 MB each, progressive download).
//
// To add a film: paste its Vimeo ID below. For a public video the ID is the
// number in https://vimeo.com/1211661544. For an *unlisted* video the URL
// looks like https://vimeo.com/1211661544/abc123def — then the second part
// goes into 'vimeo_hash'. Entries without an ID are skipped automatically.
//
// 'aspect' stays as on the live site: the Vimeo masters are 16:9 with the
// letterbox bars baked in, and the player crops to this ratio to remove them.
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

// Only films that actually have a Vimeo ID can be shown.
$pending = array_values(array_filter($showcases, fn ($s) => $s['vimeo_id'] === ''));
$showcases = array_values(array_filter($showcases, fn ($s) => $s['vimeo_id'] !== ''));
@endphp

{{-- data-preload is what the JS reads to pick the strategy (see PRELOAD in
     resources/js/modules/vimeo-player.js). --}}
<div class="relative" data-showcases @if($preload) data-preload @endif>

  @if(count($showcases))
    <x-swiper.wrapper>
      @foreach($showcases as $showcase)
        <x-swiper.slide>
          <x-showcase-vimeo
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

  {{-- Test-page scaffolding: never shown on the live site. --}}
  <div class="px-20 lg:px-0 mt-60 lg:mt-80 text-md text-smoke">
    <p class="mb-10">
      <em>Testversion mit Vimeo — {{ $preload ? 'mit Vorladen' : 'ohne Vorladen' }}.</em>
      @if($preload)
        Sobald der erste Film läuft, wird der Anfang des nächsten im Hintergrund geladen.
      @else
        Der nächste Film wird erst beim Umschalten geladen.
      @endif
    </p>

    <p class="mb-10">
      Andere Varianten:
      @if($preload)
        <a href="{{ route('landing.vimeo') }}" class="text-black hover:underline">Vimeo ohne Vorladen</a>,
      @else
        <a href="{{ route('landing.vimeo.preload') }}" class="text-black hover:underline">Vimeo mit Vorladen</a>,
      @endif
      <a href="{{ route('landing') }}" class="text-black hover:underline">selbst gehostete MP4s</a>.
    </p>

    <p class="mb-10">
      Mit <code>?debug</code> in der URL erscheint pro Film die Zeit bis zum ersten Bild.
    </p>

    @if(count($pending))
      <p>
        Noch nicht auf Vimeo:
        {{ implode(', ', array_column($pending, 'title')) }}.
      </p>
    @endif
  </div>

</div>
@endsection
