@props([
  'src_high' => '',
  'src_low' => '',
  'aspect' => 'aspect-[16/9]',
  'poster' => '',
  'loop' => true,
  'muted' => false,
])

<div class="relative {{ $aspect }} w-full bg-black group video-player-container">

  <video
    poster="{{ $poster }}"
    class="w-full h-full object-cover showcase-video video-element"
    {{ $loop ? 'loop' : '' }}
    {{ $muted ? 'data-muted' : '' }}
    playsinline>
    <source src="{{ $src_high }}" media="(min-width: 1024px)" type="video/mp4">
    <source src="{{ $src_low }}" type="video/mp4">
  </video>

  {{-- Controls overlay --}}
  <div class="absolute inset-0 transition-opacity duration-300 opacity-0 video-controls">

    {{-- Bottom controls bar --}}
    <div class="absolute bottom-0 left-0 right-0 px-20 pb-20 pt-40">

      {{-- Controls buttons --}}
      <div class="flex items-center gap-x-12 lg:gap-x-18">

        {{-- Play/Pause button --}}
        <div class="w-20 h-23 flex items-center justify-center">
          <button type="button" class="shrink-0 cursor-pointer hover:opacity-80 transition-colors play-btn">
            <x-icons.play class="w-auto h-23" />
          </button>
          <button type="button" class="shrink-0 cursor-pointer hover:opacity-80 transition-colors pause-btn hidden">
            <x-icons.pause class="w-auto h-20" />
          </button>
        </div>

        {{-- Progress bar --}}
        <div class="relative flex-1 cursor-pointer group/progress progress-bar py-8">
          <div class="relative h-2">
            <div class="absolute inset-0 bg-[#EAEAEA]"></div>
            <div class="absolute left-0 top-0 bottom-0 bg-transparent rounded-full transition-all progress-filled" style="width: 0%"></div>
            <div class="absolute top-1/2 -translate-y-1/2 w-2 h-20 bg-[#EAEAEA] rounded-full transition-all progress-handle" style="left: -1px"></div>
          </div>
        </div>

        {{-- Time remaining --}}
        <div class="text-white text-md shrink-0 tabular-nums">
          <span class="time-remaining">00:00</span>
        </div>

        {{-- Fullscreen button --}}
        <button type="button" class="w-22 h-22 flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-colors fullscreen-btn">
          <x-icons.fullscreen />
        </button>

        {{-- Sound button --}}
        <button type="button" class="w-30 h-auto flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-colors mute-btn">
          <x-icons.sound-on />
        </button>
        <button type="button" class="w-30 h-auto flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-colors unmute-btn hidden">
          <x-icons.sound-off />
        </button>

      </div>
    </div>
  </div>
</div>
