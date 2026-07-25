import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    laravel({
      input: [
        'resources/css/app.css',
        'resources/js/app.js',
        // Entry for the Vimeo test pages (/vimeo, /vimeo-preload)
        'resources/js/vimeo.js',
      ],
      refresh: true,
    }),
    tailwindcss(),
  ],
});