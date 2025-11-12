@props([
  'title' => '',
  'src' => '',
  'poster' => '',
  'info' => '',
  'data' => [],
])

<article 
  x-data="{ show_info: false }" 
  class="mb-60">

  <video
    src="{{ $src }}"
    poster="{{ $poster }}"
    class="w-full h-auto"
    loop
    muted
    controls>
  </video>

  <div class="px-20 mt-10">

    <div class="flex w-full justify-between items-start">

      <h2 class="text-xl leading-[1.06] mb-6">{{ $title }}</h2>

      <button
        x-on:click="show_info = !show_info"
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
      x-show="show_info"
      x-cloak>

      <div class="text-lg leading-none mb-30">
        <em>{{ $info }}</em>
      </div>

      <div class="flex flex-col gap-y-16">

        @foreach($data as $d)

          <div>
            <label class="text-sm">
              <em>{{ $d['label'] }}</em>
            </label>
            <div class="text-md leading-[1.31]">
              {!! $d['text'] !!}
            </div>
          </div>

        @endforeach

      </div>

    </div>

  </div>

</article>
