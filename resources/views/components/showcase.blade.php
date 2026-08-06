@props([
  'title' => '',
  'vimeo_id' => '',
  'vimeo_hash' => '',
  'aspect' => 'aspect-[16/9]',
  'poster' => '',
  'info' => '',
  'cast' => '',
  'production' => '',
  'director' => '',
])

{{-- Vimeo variant of components/showcase.blade.php — identical apart from the player. --}}
<article class="mb-60 lg:mb-0 lg:relative">

  <x-vimeo-player
    :vimeo_id="$vimeo_id"
    :vimeo_hash="$vimeo_hash"
    :title="$title"
    :aspect="$aspect"
    :poster="$poster"
    :loop="true"
  />

  {{-- Mobile only version — the film details are always on show. --}}
  <div class="px-20 mt-10 lg:hidden">
    <h2 class="text-xl leading-[1.06] mb-6">
      {{ $title }}
    </h2>

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

</article>
