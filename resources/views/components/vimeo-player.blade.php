@props([
  'vimeo_id' => '',
  'vimeo_hash' => '',
  'title' => '',
  'aspect' => 'aspect-[16/9]',
  'poster' => '',
  'loop' => true,
  'muted' => false,
  'overscan' => '1.01',
])

{{--
  The film player. Delivery is Vimeo (adaptive HLS), but the control bar below
  is the site's own markup — the embed runs with controls:false.

  The iframe is NOT rendered here. modules/vimeo-player.js creates it on
  demand so that loading the page does not start four Vimeo players at once.
  Until then the poster image stands in as a facade.
--}}
<div
  class="relative {{ $aspect }} w-full bg-black group overflow-hidden"
  data-vimeo-player
  data-vimeo-id="{{ $vimeo_id }}"
  data-vimeo-hash="{{ $vimeo_hash }}"
  data-title="{{ $title }}"
  data-overscan="{{ $overscan }}"
  @if($loop) data-loop @endif
  @if($muted) data-muted @endif>

  {{--
    The iframe is sized in JS to cover this box: the Vimeo masters are 16:9
    with the letterbox bars baked in, so the bars have to be cropped away
    against the showcase's real aspect ratio.
  --}}
  <div
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [&>iframe]:block [&>iframe]:w-full [&>iframe]:h-full"
    data-vimeo-stage></div>

  {{-- Click-to-toggle layer: the iframe runs with controls:false and swallows
       clicks, so play/pause on the video body needs its own surface. --}}
  <div class="absolute inset-0 cursor-pointer" data-click-layer></div>

  {{-- Poster facade: paints instantly and doubles as the click-to-play target --}}
  @if($poster)
    <div
      class="absolute inset-0 bg-center bg-cover transition-opacity duration-500 cursor-pointer"
      style="background-image: url('{{ $poster }}')"
      data-poster></div>
  @endif

  {{-- Buffering indicator --}}
  <div
    class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 pointer-events-none"
    data-spinner>
    <span class="block w-30 h-30 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
  </div>

  {{-- Controls overlay --}}
  <div class="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none" data-controls>

    {{-- Bottom controls bar --}}
    <div class="absolute bottom-0 left-0 right-0 px-20 pb-20 pt-40 pointer-events-auto">

      {{-- Controls buttons --}}
      <div class="flex items-center gap-x-12 lg:gap-x-18">

        {{-- Play/Pause button --}}
        <div class="w-20 h-23 flex items-center justify-center">
          <button type="button" class="shrink-0 cursor-pointer hover:opacity-80 transition-colors" data-play-btn>
            <x-icons.play class="w-auto h-23" />
          </button>
          <button type="button" class="shrink-0 cursor-pointer hover:opacity-80 transition-colors hidden" data-pause-btn>
            <x-icons.pause class="w-auto h-20" />
          </button>
        </div>

        {{-- Progress bar --}}
        <div class="relative flex-1 cursor-pointer group/progress py-8" data-progress-bar>
          <div class="relative h-2" data-progress-track>
            <div class="absolute inset-0 bg-[#EAEAEA]"></div>
            <div class="absolute left-0 top-0 bottom-0 bg-transparent rounded-full transition-all" data-progress-filled style="width: 0%"></div>
            <div class="absolute top-1/2 -translate-y-1/2 w-2 h-20 bg-[#EAEAEA] rounded-full transition-all" data-progress-handle style="left: -1px"></div>
          </div>
        </div>

        {{-- Time remaining --}}
        <div class="text-white text-md shrink-0 tabular-nums">
          <span data-time-remaining>00:00</span>
        </div>

        {{-- Fullscreen button --}}
        <button type="button" class="w-22 h-22 flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-colors" data-fullscreen-btn>
          <x-icons.fullscreen />
        </button>

        {{-- Sound button --}}
        <button type="button" class="w-30 h-auto flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-colors" data-mute-btn>
          <x-icons.sound-on />
        </button>
        <button type="button" class="w-30 h-auto flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-colors hidden" data-unmute-btn>
          <x-icons.sound-off />
        </button>

      </div>
    </div>
  </div>

  {{-- Timing readout, only rendered with ?debug. Local development only —
       the live site is a static export, where this is always evaluated to
       false at build time. --}}
  @if(request()->has('debug'))
    <div class="absolute top-0 left-0 bg-black/70 text-white text-sm px-10 py-6 tabular-nums z-10">
      <span data-timing>waiting…</span>
    </div>
  @endif
</div>
