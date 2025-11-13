<button 
  class="
    cursor-pointer
    absolute
    z-10
    top-1/2
    -translate-y-1/2
    hidden
    lg:block
    {{ $class ?? '' }}">
  {{ $slot }}
</button>
