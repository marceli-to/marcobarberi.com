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
- Alpine.js for interactive state management (collapsible details)
- Tailwind utility classes applied directly to elements
- Loop-based rendering for flexible data structures

**Video Delivery**
The films stream from Vimeo (adaptive HLS) through the official Player SDK,
behind the site's own control bar — the embed runs with `controls:false`.
Iframes are created lazily: the active slide first, the next one prewarmed
while it plays, the rest only when shown. Add a film by pasting its Vimeo ID
into the `$showcases` array in `landing.blade.php`. The MP4s still sitting in
`public/video/` are unused leftovers; only the poster JPGs next to them matter.

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
