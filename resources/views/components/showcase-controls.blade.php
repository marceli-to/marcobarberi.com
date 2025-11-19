@props([
  'showcases' => []
])

<div class="hidden lg:block mt-20 px-0 relative" x-data="{ activeSlide: 0, show_info: false }">
  <div class="flex relative">
    <div class="flex flex-col w-1/2 2xl:w-1/3 pr-10 justify-start items-start">

      <template x-for="(showcase, index) in {{ json_encode($showcases) }}" :key="index">
        <h2
          x-show="activeSlide === index"
          class="text-xl leading-[1.06] mb-6"
          x-text="showcase.title">
        </h2>
      </template>

      <div
        x-collapse
        x-show="show_info"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="transition ease-in duration-0"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0"
        class="text-lg leading-none">
        <template x-for="(showcase, index) in {{ json_encode($showcases) }}" :key="index">
          <em x-show="activeSlide === index" x-text="showcase.info"></em>
        </template>
      </div>

      <div class="flex items-center gap-x-10 absolute right-0 min-w-auto z-10">
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

        <x-swiper.button class="block w-auto h-32 swiper-btn-prev">
          <x-icons.chevron-left class="w-auto h-full" />
        </x-swiper.button>

        <x-swiper.button class="block w-auto h-32 swiper-btn-next">
          <x-icons.chevron-right class="w-auto h-full" />
        </x-swiper.button>
      </div>
    </div>

    <div
      x-collapse
      x-show="show_info"
      x-transition:enter="transition ease-out duration-300"
      x-transition:enter-start="opacity-0"
      x-transition:enter-end="opacity-100"
      x-transition:leave="transition ease-in duration-0"
      x-transition:leave-start="opacity-100"
      x-transition:leave-end="opacity-0"
      class="w-1/2 2xl:w-2/3">

      <template x-for="(showcase, index) in {{ json_encode($showcases) }}" :key="index">
        <div x-show="activeSlide === index" class="flex flex-row gap-y-16 pr-40 lg:pr-105">
          <div class="order-2" x-show="showcase.cast">
            <label class="text-sm">
              <em>Cast</em>
            </label>
            <div class="text-md leading-[1.3]" x-html="showcase.cast"></div>
          </div>

          <div class="flex flex-col gap-y-16 order-1">

            <div class="order-2 pr-40" x-show="showcase.production">
              <label class="text-sm">
                <em>Production</em>
              </label>
              <div class="text-md leading-[1.3]" x-html="showcase.production"></div>
            </div>

            <div class="order-1 pr-40" x-show="showcase.director">
              <label class="text-sm">
                <em>Director</em>
              </label>
              <div class="text-md leading-[1.3]" x-html="showcase.director"></div>
            </div>

          </div>
        </div>
      </template>
    </div>
  </div>
</div>
