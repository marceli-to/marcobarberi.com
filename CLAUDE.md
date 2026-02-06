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
  - `landing.blade.php` - Home page with film showcases
  - **components/** - Reusable Blade components
    - `showcase.blade.php` - Film/video showcase component with expandable details
    - **layout/** - Layout-related components

- **resources/css/** - Stylesheets
  - `app.css` - Main Tailwind CSS file with custom styles

- **routes/** - Application routes
  - `web.php` - Web routes (currently just home route to landing view)

### Key Patterns

**Component-Based Architecture**
- Reusable Blade components for UI elements
- Components are self-contained with inline Tailwind classes
- Example: `<x-showcase>` component for film/video presentations

**Showcase Component Pattern**
The `showcase.blade.php` component demonstrates the project's approach:
- Props: `title`, `src`, `poster`, `info`, `data` (array of label/text pairs)
- Alpine.js for interactive state management (collapsible details)
- Tailwind utility classes applied directly to elements
- Loop-based rendering for flexible data structures

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
- Single route application (home page only)
