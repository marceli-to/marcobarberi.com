@props([
  'title' => '',
  'src_high' => '',
  'src_low' => '',
  'aspect' => 'aspect-[16/9]',
  'poster' => '',
  'info' => '',
  'cast' => '',
  'production' => '',
  'director' => '',
])

<article 
  class="mb-60 lg:mb-0 lg:relative" 
  x-data="{ show_info: false }">

  <video
    poster="{{ $poster }}"
    class="w-full h-auto {{ $aspect }} showcase-video"
    :class="{ 'pointer-events-none': show_info }"
    loop
    muted
    playsinline
    controls>
    <source src="{{ $src_high }}" media="(min-width: 1024px)" type="video/mp4">
    <source src="{{ $src_low }}" type="video/mp4">
  </video>

  {{-- Mobile only version --}}
  <div class="px-20 mt-10 lg:hidden">
    <div class="flex w-full justify-between items-start">
      <h2 class="text-xl leading-[1.06] mb-6">
        {{ $title }}
      </h2>

      <button
        @click.stop.prevent="show_info = !show_info"
        type="button"
        class="cursor-pointer shrink-0">
        <svg
          width="35"
          height="35"
          viewBox="0 0 35 35"
          fill="none"
          class="block w-35 h-35 rotate-0 transition-transform"
          :class="{ '!-rotate-45': show_info }">
          <path d="M0 17.2422H34.484" stroke="#707070"/>
          <path d="M17.2417 0L17.2417 34.484" stroke="#707070"/>
        </svg>
      </button>
    </div>

    <div
      x-collapse
      x-show="show_info"
      x-transition:enter="transition ease-out duration-300"
      x-transition:enter-start="opacity-0"
      x-transition:enter-end="opacity-100"
      x-transition:leave="transition ease-in duration-0"
      x-transition:leave-start="opacity-100"
      x-transition:leave-end="opacity-0">

      <div class="text-lg leading-none mb-30">
        <em>{{ $info }}</em>
      </div>

      <div class="flex flex-col gap-y-16">
        @if($cast)
          <div>
            <label class="text-sm">
              <em>Cast</em>
            </label>
            <div class="text-md leading-[1.3]">
              {!! $cast !!}
            </div>
          </div>
        @endif

        @if($production)
          <div>
            <label class="text-sm">
              <em>Production</em>
            </label>
            <div class="text-md leading-[1.3]">
              {!! $production !!}
            </div>
          </div>
        @endif

        @if($director)
          <div>
            <label class="text-sm">
              <em>Director</em>
            </label>
            <div class="text-md leading-[1.3]">
              {!! $director !!}
            </div>
          </div>
        @endif
      </div>
    </div>
  </div>

</article>
