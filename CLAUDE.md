# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for Marco Barberi built with Vite, Tailwind CSS 4, and Alpine.js.

## Tech Stack

- **Vite 5.4.2** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework (via PostCSS)
- **Alpine.js 3.15.1** - Lightweight JavaScript framework
- **PostCSS** - CSS processing with Autoprefixer

## Common Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production to dist/
npm run preview      # Preview production build locally
```

## Project Structure

```
marcobarberi.com/
├── index.html           # Main HTML entry point
├── src/
│   ├── js/
│   │   └── app.js      # Main JS entry - imports CSS and initializes Alpine.js
│   ├── css/
│   │   └── app.css     # Main CSS - Tailwind imports, fonts, and theme config
│   └── fonts/          # Custom font files
├── public/             # Static assets served as-is
├── vite.config.js      # Vite configuration
└── postcss.config.js   # PostCSS with Tailwind and Autoprefixer
```

## Architecture Notes

### CSS Architecture
- Tailwind CSS 4 is configured via PostCSS (not the Vite plugin)
- Custom fonts are loaded via `@font-face` in `src/css/app.css`
- Tailwind theme customization uses `@theme` directive in CSS
- Custom colors and fonts are defined in `app.css` using CSS variables

### JavaScript Architecture
- Alpine.js is initialized globally in `src/js/app.js`
- `window.Alpine` is exposed for global access
- CSS is imported from `../css/app.css` in the JS entry point

### Build Configuration
- Vite uses default configuration (minimal setup in `vite.config.js`)
- PostCSS handles Tailwind CSS processing and autoprefixing
- HTML references `/src/js/app.js` which Vite processes automatically

### Language
The site is configured for German (`lang="de"` in HTML)
