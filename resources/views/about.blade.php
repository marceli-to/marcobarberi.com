@extends('app')
@section('content')
<div class="relative px-20 pb-20 lg:px-0">

  <h1 class="text-smoke text-sm lg:mb-4">
    About
  </h1>

  <div class="md:grid md:grid-cols-11">
    <div class="md:col-span-7 lg:col-span-7 text-lg lg:text-xl leading-[1.2] hyphens-auto">
      <p>Marco Barberi, a classical secondo, grew up in Italy and Switzerland. After high school, he enrolled in the renowned diploma program in Photography at the Zurich University of the Arts, where he graduated in 1989 with an MFA. From 1997 to 1999, he studied cinematography at the American Film Institute in Los Angeles, further honing his skills in visual storytelling.</p>
      <p class="mt-20">Since then, Marco has worked on films in various countries across three continents, shot both digitally and on celluloid, in studios and on location, incorporating state-of-the-art technology and “old-school in-camera” tricks, both features and documentaries.</p>
      <p class="mt-20">The Swiss-Canadian coproduction “JILL” by Steven Hayes earned Marco a nomination for “Best Cinematography” at the Swiss Film Awards 2023. He has also won two EDI’s for Best Cinematography on Commercials.</p>
    </div>
    <div class="md:col-span-3 md:col-start-9 lg:col-span-3 lg:col-start-9 mt-15 md:mt-0">
      <picture>
        <source srcset="/img/marco-barberi-portrait.avif" type="image/avif">
        <source srcset="/img/marco-barberi-portrait.webp" type="image/webp">
        <img src="/img/marco-barberi-portrait.jpg" width="900" height="1273" alt="Portrait Marco Barberi" class="w-full h-auto max-w-[80%] md:max-w-none">
      </picture>
    </div>
  </div>

  <div class="mt-100 md:mt-60">
    <h2 class="text-smoke text-sm mb-12">
      Selected work
    </h2>
    <div class="flex flex-col gap-y-20 md:gap-0 md:grid md:grid-cols-11">

      <article class="md:col-span-3">
        <h3>Butterfly Stroke</h3>
        <div class="text-smoke">
          Denis Rabaglia / Judy Davis, Florence Hunt, Samuel Streiff / Turnus Film CH and Zephyr Films GB<br>Feature / CH / GB 2026
        </div>
      </article>

      <article class="md:col-span-3 md:col-start-5">
        <h3>Barry and Me</h3>
        <div class="text-smoke">
          Markus Welter / Ulrich Tukur, Max Hubacher, Paco von Wyss, Alma Büchenbacher / Atlantis Pictures CH / MMC Zodiac DE<br>Feature / CH / DE 2026
        </div>
      </article>

      <article class="md:col-span-3 md:col-start-9">
        <h3>On the High Seas</h3>
        <div class="text-smoke">
          Denis Rabaglia / Maud Wyler, Carlos Bardem, Michael Neuenschwander, Isaline Prevost, Nicolas Perot, Philippe Torreton / Alva Film CH / Galea Katz Filmleak ES<br>TV Series / CH / ES 2024
        </div>
      </article>

      <article class="md:col-span-3 md:mt-20">
        <h3>Jill</h3>
        <div class="text-smoke">
          Steven Hayes / Tom Pelphrey, Juliet Rylance, Zackary Arthur, Garret Waring, Dree Hemingway / Hugofilm Features CH / K5 DE<br>Feature / CH / CAN 2022
        </div>
      </article>

      <article class="md:col-span-3 md:col-start-5 md:mt-20">
        <h3>40 & Climbing</h3>
        <div class="text-smoke">
          Bindu De Stoppani / Euridice Axen, Elena Di Ciochi, Anna Ferzetti, Irene Casagrande / Hugofilm Features<br>Feature / CH / ITA 2021
        </div>
      </article>

      <article class="md:col-span-3 md:col-start-9 md:mt-20">
        <h3>Miraggio</h3>
        <div class="text-smoke">
          Nina Stefanka / Sekou Coulibaly, Yassine, Bah Daouda, Issa Dembele / Cinédokké CH<br>Documentary / CH / ITA 2020
        </div>
      </article>

      <article class="md:col-span-3 md:mt-20">
        <h3>Finding Camille</h3>
        <div class="text-smoke">
          Bindu De Stoppani / Luigi Diberti, Anna Ferzetti, Nicola Mastroberardino / Hugofilm Features CH<br>Feature / CH / ITA / BIH 2017
        </div>
      </article>

      <article class="md:col-span-3 md:col-start-5 md:mt-20">
        <h3>Carl Lutz</h3>
        <div class="text-smoke">
          Daniel Von Aarburg / György Konrad, Agens Heller, Leslie Blau, Agnes Hirschi / Docmine Productions CH<br>Documentary / HUN / ISR / USA / AUT 2014
        </div>
      </article>

      <article class="md:col-span-3 md:col-start-9 md:mt-20">
        <h3>Victoria</h3>
        <div class="text-smoke">
          Men Lareida / Franciska Farkas, Zsolt Nagy, Angela Stefanovics / Hesse Greutert Film CH / Proton HU<br>Feature / CH / HUN 2014
        </div>
      </article>

      <article class="md:col-span-3 md:mt-20">
        <h3>Cannabis</h3>
        <div class="text-smoke">
          Niklaus Hilber / Joel Basman, Hanspeter Müller, Deleila Piasko, Jean Pierre Cornu / Vega Film CH<br>Feature / CH 2006
        </div>
      </article>
      
    </div>
  </div>

</div>
@endsection