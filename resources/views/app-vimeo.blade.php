{{--
  Layout for the Vimeo test page. Identical to app.blade.php except that it
  loads the vimeo.js bundle instead of app.js, and asks search engines to keep
  the test page out of the index.
--}}
@section('meta')
<meta name="robots" content="noindex, nofollow">
{{-- Get the TLS handshakes to Vimeo out of the way before the embed is built;
     the player, its assets and the video segments live on three hosts. --}}
<link rel="preconnect" href="https://player.vimeo.com" crossorigin>
<link rel="preconnect" href="https://f.vimeocdn.com" crossorigin>
<link rel="preconnect" href="https://i.vimeocdn.com" crossorigin>
<link rel="dns-prefetch" href="https://vod-adaptive-ak.vimeocdn.com">
@endsection

<x-layout.head />
<x-layout.header />
<x-layout.body>
  <x-layout.main>
    @yield('content')
  </x-layout.main>
</x-layout.body>
<x-layout.footer entry="resources/js/vimeo.js" />
