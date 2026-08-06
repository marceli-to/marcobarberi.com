# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Laravel 12 application (marcobarberi.com) - a minimal portfolio/showcase website for film and video projects. Built with Tailwind CSS and Alpine.js, focusing on a clean, component-based architecture.

## Development Commands

### Setup
```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

### Development
```bash
# Start development server
php artisan serve

# Frontend development (Vite)
npm run dev

# Watch for changes
npm run watch

# Build for production
npm run build
```

### Testing
```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit

# Run single test file
php artisan test tests/Feature/ExampleTest.php
```

### Code Quality
```bash
# Format code with Laravel Pint
./vendor/bin/pint

# Run specific file
./vendor/bin/pint path/to/file.php
```

### Cache Management
```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
php artisan optimize
```

## Architecture

### Directory Structure

- **resources/views/** - Blade templates and views
  - `app.blade.php` - Main layout file
  - `landing.blade.php` - Home page with film showcases; also holds the film list
  - **components/** - Reusable Blade components
    - `showcase.blade.php` - Film/video showcase component with expandable details
    - `vimeo-player.blade.php` - Player markup and controls (iframe is built in JS)
    - **layout/** - Layout-related components

- **resources/css/** - Stylesheets
  - `app.css` - Main Tailwind CSS file with custom styles

- **resources/js/modules/** - Frontend behaviour
  - `vimeo-player.js` - Drives the Vimeo embeds behind the site's own controls
  - `swiper.js` - Desktop slider; decides when each embed gets built

- **routes/** - Application routes
  - `web.php` - Three routes: `/`, `/about`, `/contact`

### Key Patterns

**Component-Based Architecture**
- Reusable Blade components for UI elements
- Components are self-contained with inline Tailwind classes
- Example: `<x-showcase>` component for film/video presentations

**Showcase Component Pattern**
The `showcase.blade.php` component demonstrates the project's approach:
- Props: `title`, `vimeo_id`, `vimeo_hash`, `aspect`, `poster`, `info`, `cast`, `production`, `director`
- The film details below the player are always visible (no toggle); on
  desktop they live in `showcase-controls.blade.php` and follow the active
  slide via Alpine
- Tailwind utility classes applied directly to elements
- Loop-based rendering for flexible data structures

**Video Delivery**
The films stream from Vimeo (adaptive HLS) through the official Player SDK,
behind the site's own control bar — the embed runs with `controls:false`.
Iframes are created lazily: the active slide first, the next one prewarmed
while it plays, the rest only when shown. Add a film by pasting its Vimeo ID
into the `$showcases` array in `landing.blade.php`. The MP4s still sitting in
`public/video/` are unused leftovers; only the poster JPGs next to them matter.

**The swiper must never run with `loop: true`.** Swiper's loop wraps around by
relocating slides in the DOM, and moving an `<iframe>` makes the browser
reload it — every already seen film is then left with a Vimeo player talking
to a dead window (`postMessage … target origin does not match the recipient
window's origin`) and silently refuses to play. `rewind: true` gives the same
wrap-around and touches no DOM. The same trap applies to anything else that
would move a player container between parents.

Sound runs along by default. Browsers do not grant that outright, but they do
not flatly forbid it either — Chrome allows unmuted autoplay once the domain
has enough media engagement, Safari and Firefox have per-site permissions. So
`#startPlayback` in `vimeo-player.js` *attempts every start with sound* and
only falls back to muted when the browser actually refuses. Refusal has three
guises, and the third is the trap: **a resolved `play()` is no proof of
sound** — Vimeo answers a refused unmuted start by muting itself and playing
anyway, perfectly happily. Only the player's own `getMuted()` is evidence,
which is why `#confirmSound` asks it after every start; skipping that check
left the control bar claiming sound over a silent film. The other two guises
are a rejected `play()` and a player still paused 2.5 s later.

Any *other* rejection is an interruption, not a refusal — the prewarm parking
a film just as the viewer arrives on its slide — and is answered by starting
again, never by giving up the sound. Once sound has genuinely been heard
(`soundProved`), no later refusal is believed at all. Both guards matter:
without them, one film's interrupted start silenced every film after it. The
refusal is remembered globally in `soundBlocked`, and any click, tap or
keypress lifts it — which is why the opening film may be silent on a fresh
browser while every later slide has sound. `soundWanted` is separate and only the mute button
changes it, so a viewer who chooses silence is never overruled. The first
click on the film itself is spent on the sound instead of pausing.

For the case that is left — the opening film on a browser that refused — a
"Sound on" button (`[data-sound-hint]`) fades in over the running film and
asks for that one click. It only appears while a film actually runs silently
against the viewer's wish, and never returns once the sound is on. Note that
Chrome only builds up the engagement that allows unmuted autoplay on the real
domain; on a `.test` host it will refuse essentially forever, so testing the
sound locally always shows the blocked path. `window.vimeoSound()` prints the
three flags in the console when this needs untangling again.

**Preview deploys under a sub-path** (e.g. `https://marcobarberi.com/sound`,
uploaded to `/www/marcobarberi.com/public/sound/`): the normal export writes
every path root-relative, which under a sub-path silently loads the *live*
site's files instead. So export with `php artisan export --skip-fix_urls` and
prefix everything yourself — and not only in the HTML: `srcset`, and the
webfont `url(…)` inside the built CSS, are easy to miss, and missing the
fonts fails quietly with a system-font fallback. A `noindex` meta keeps the
copy out of search results. Verify by serving `dist/` under a matching
sub-path locally and watching for 404s before uploading.

### Frontend Stack

- **Laravel 12** - Latest Laravel framework
- **Vite** - Modern asset bundler
- **Tailwind CSS** - Utility-first CSS framework
- **Alpine.js** - Lightweight JavaScript framework for interactivity
- Blade templating engine

## Important Notes

- Minimal application with no database, authentication, or backend logic
- Focus on clean, maintainable component architecture
- All styling uses Tailwind CSS utility classes
- Alpine.js handles client-side interactivity
- Three routes: `/`, `/about`, `/contact`
- **The live site is a static export, not a running Laravel app.** Blade or
  Vite changes only reach production after `php artisan export` (config in
  `config/export.php`) and an upload of the changed `dist/` files to Hostpoint.
