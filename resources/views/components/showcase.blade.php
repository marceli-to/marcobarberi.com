@props([
  'title' => '',
  'src' => '',
  'aspect' => 'aspect-[16/9]',
  'poster' => '',
  'info' => '',
  'cast' => '',
  'production' => '',
  'director' => '',
])

<article 
  x-data="{ show_info: false }" 
  class="mb-60 lg:mb-0 lg:relative _flex _flex-col _justify-between">

  <video
    src="{{ $src }}"
    poster="{{ $poster }}"
    class="w-full h-auto {{ $aspect }}"
    _class="w-auto h-[600px]"
    loop
    muted
    controls>
  </video>

  <div class="px-20 mt-10 lg:mt-20 lg:px-0 lg:flex lg:relative">

    <div class="flex w-full lg:flex-col lg:w-1/2 justify-between lg:justify-start items-start">

      <h2 class="text-xl leading-[1.06] mb-6 lg:w-auto">
        {{ $title }}
      </h2>
      
      <div 
        x-show="show_info"
        x-cloak
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="transition ease-in duration-0"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0"
        class="text-lg leading-none hidden lg:block">
        <em>{{ $info }}</em>
      </div>

      <button
        x-on:click="show_info = !show_info"
        class="
          cursor-pointer 
          shrink-0 
          lg:absolute
          lg:right-0
          lg:top-0
          lg:z-50">

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
      x-show="show_info"
      x-cloak
      x-transition:enter="transition ease-out duration-300"
      x-transition:enter-start="opacity-0"
      x-transition:enter-end="opacity-100"
      x-transition:leave="transition ease-in duration-0"
      x-transition:leave-start="opacity-100"
      x-transition:leave-end="opacity-0">

      <div class="text-lg leading-none mb-30 lg:hidden">
        <em>{{ $info }}</em>
      </div>

      <div class="flex flex-col lg:flex-row gap-y-16 lg:pr-40">

        @if($cast)
          <div class="lg:order-2 lg:pl-40">
            <label class="text-sm">
              <em>Cast</em>
            </label>
            <div class="text-md leading-[1.31]">
              {!! $cast !!}
            </div>
          </div>
        @endif

        <div class="lg:flex lg:flex-col lg:gap-y-16 lg:order-1 lg:pr-40">

          @if($production)
            <div class="lg:order-2">
              <label class="text-sm">
                <em>Production</em>
              </label>
              <div class="text-md leading-[1.31]">
                {!! $production !!}
              </div>
            </div>
          @endif

          @if($director)
            <div class="lg:order-1">
              <label class="text-sm">
                <em>Director</em>
              </label>
              <div class="text-md leading-[1.31]">
                {!! $director !!}
              </div>
            </div>
          @endif
        </div>

      </div>

    </div>

  </div>

</article>
