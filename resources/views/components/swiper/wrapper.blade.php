<div class="swiper {{ $class ?? '' }}">
  <div class="swiper-wrapper flex-col lg:flex-row">
    {{ $slot }}
  </div>
</div>

{{-- <x-swiper.button class="w-20 h-auto left-0 -translate-x-36 swiper-btn-prev">
  <x-icons.chevron-left class="w-full h-auto" />
</x-swiper.button>

<x-swiper.button class="w-20 h-auto right-0 translate-x-36 swiper-btn-next">
  <x-icons.chevron-right class="w-full h-auto" />
</x-swiper.button> --}}

<x-swiper.button class="hidden lg:block w-20 h-auto fixed left-10 2xl:left-25 2xl:top-1/2 2xl:-translate-y-1/2  swiper-btn-prev">
  <x-icons.chevron-left class="w-full h-auto" />
</x-swiper.button>

<x-swiper.button class="hidden lg:block w-20 h-auto fixed right-10 2xl:right-25 2xl:top-1/2 2xl:-translate-y-1/2 swiper-btn-next">
  <x-icons.chevron-right class="w-full h-auto" />
</x-swiper.button>

