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
        <div class="text-smoke text-balance">
          Denis&nbsp;Rabaglia / Judy&nbsp;Davis, Florence&nbsp;Hunt, Samuel&nbsp;Streiff<br>Turnus Film CH and Zephyr Films GB<br>Feature / CH / GB 2026
        </div>
      </article>

      <article class="md:col-span-3 md:col-start-5">
        <h3>Barry and Me</h3>
        <div class="text-smoke text-balance">
          Markus&nbsp;Welter / Ulrich&nbsp;Tukur, Max&nbsp;Hubacher, Paco&nbsp;von&nbsp;Wyss, Alma&nbsp;Büchenbacher<br>Atlantis Pictures CH / MMC Zodiac DE<br>Feature / CH / DE 2026
        </div>
      </article>

      <article class="md:col-span-3 md:col-start-9">
        <h3>On the High Seas</h3>
        <div class="text-smoke text-balance">
          Denis&nbsp;Rabaglia / Maud&nbsp;Wyler, Carlos&nbsp;Bardem, Michael&nbsp;Neuenschwander, Isaline&nbsp;Prevost, Nicolas&nbsp;Perot, Philippe Torreton<br>Alva Film CH / Galea Katz Filmleak ES<br>TV Series / CH / ES 2024
        </div>
      </article>

      <article class="md:col-span-3 md:mt-20">
        <h3>Jill</h3>
        <div class="text-smoke text-balance">
          Steven&nbsp;Hayes / Tom&nbsp;Pelphrey, Juliet&nbsp;Rylance, Zackary&nbsp;Arthur, Garret&nbsp;Waring, Dree&nbsp;Hemingway<br>Hugofilm Features CH / K5 DE<br>Feature / CH / CAN 2022
        </div>
      </article>

      <article class="md:col-span-3 md:col-start-5 md:mt-20">
        <h3>40 & Climbing</h3>
        <div class="text-smoke text-balance">
          Bindu&nbsp;De&nbsp;Stoppani / Euridice&nbsp;Axen, Elena&nbsp;Di&nbsp;Ciochi, Anna&nbsp;Ferzetti, Irene&nbsp;Casagrande<br>Hugofilm Features<br>Feature / CH / ITA 2021
        </div>
      </article>

      <article class="md:col-span-3 md:col-start-9 md:mt-20">
        <h3>Miraggio</h3>
        <div class="text-smoke text-balance">
          Nina&nbsp;Stefanka / Sekou&nbsp;Coulibaly, Yassine, Bah&nbsp;Daouda, Issa&nbsp;Dembele<br>Cinédokké CH<br>Documentary / CH / ITA 2020
        </div>
      </article>

      <article class="md:col-span-3 md:mt-20">
        <h3>Finding Camille</h3>
        <div class="text-smoke text-balance">
          Bindu&nbsp;De&nbsp;Stoppani / Luigi&nbsp;Diberti, Anna&nbsp;Ferzetti, Nicola&nbsp;Mastroberardino<br>Hugofilm Features CH<br>Feature / CH / ITA / BIH 2017
        </div>
      </article>

      <article class="md:col-span-3 md:col-start-5 md:mt-20">
        <h3>Carl Lutz</h3>
        <div class="text-smoke text-balance">
          Daniel&nbsp;Von&nbsp;Aarburg / György&nbsp;Konrad, Agens&nbsp;Heller, Leslie&nbsp;Blau, Agnes&nbsp;Hirschi<br>Docmine Productions CH<br>Documentary / HUN / ISR / USA / AUT 2014
        </div>
      </article>

      <article class="md:col-span-3 md:col-start-9 md:mt-20">
        <h3>Victoria</h3>
        <div class="text-smoke text-balance">
          Men&nbsp;Lareida / Franciska&nbsp;Farkas, Zsolt&nbsp;Nagy, Angela&nbsp;Stefanovics<br>Hesse Greutert Film CH / Proton HU<br>Feature / CH / HUN 2014
        </div>
      </article>

      <article class="md:col-span-3 md:mt-20">
        <h3>Cannabis</h3>
        <div class="text-smoke text-balance">
          Niklaus&nbsp;Hilber / Joel&nbsp;Basman, Hanspeter&nbsp;Müller, Deleila&nbsp;Piasko, Jean&nbsp;Pierre&nbsp;Cornu<br>Vega Film CH<br>Feature / CH 2006
        </div>
      </article>
      
    </div>
  </div>

</div>
@endsection