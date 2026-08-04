<?php

return [

    /*
     * If true, the exporter will crawl through your site's pages to determine
     * the paths that need to be exported.
     */
    'crawl' => true,

    /*
     * Add additional paths to be added to the export here. If you're using the
     * `crawl` option, you probably don't need to add anything here.
     *
     * For example: "about", "posts/featured"
     */
    'paths' => [
        //
    ],

    /*
     * Files and folders that should be included in the build. Expects
     * key/value pairs with current paths as keys, and destination paths
     * as values.
     *
     * By default your `public` folder's contents will be added to the export.
     */
    'include_files' => [
        'public' => '',
    ],

    /*
     * File patterns that should be excluded from the included files.
     */
    'exclude_file_patterns' => [
        '/\.php$/',
        '/mix-manifest\.json$/',
        '/\.mp4$/',
        '/\.DS_Store$/',
    ],

    /*
     * Whether or not the destination folder should be emptied before starting
     * the export.
     */
    'clean_before_export' => true,

    /*
     * If set, the site will be exported to this disk. Disks can be configured
     * in `config/filesystems.php`.
     *
     * If empty, your site will be exported to a `dist` folder.
     */
    'disk' => null,

    /*
     * Shell commands that should be run before the export starts when running
     * `php artisan export`.
     *
     * You can skip these by adding a `--skip-{name}` flag to the command.
     */
    'before' => [
        'assets' => 'npm run build',
    ],

    /*
     * Shell commands that should be run after the export has finished when
     * running `php artisan export`.
     *
     * You can skip these by adding a `--skip-{name}` flag to the command.
     */
    'after' => [
        /*
         * The first expression must stay first. og:url has to be an absolute
         * URL, but the generic rule below strips the host from anything with a
         * path (".../about" -> "/about"), which left og:url relative on every
         * subpage. Rewriting og:url to the production host up front means the
         * generic rules no longer find a `.test` host inside that tag.
         *
         * `[^>]*` stands in for `" content="` so no quotes are needed here,
         * and it cannot run past the end of the tag.
         */
        'fix_urls' => 'find dist -type f -name "*.html" -exec sed -i "" -e "s|og:url\([^>]*\)https://marcobarberi\.com\.test|og:url\1https://marcobarberi.com|g" -e "s|https://marcobarberi\.com\.test/|/|g" -e "s|https://marcobarberi\.com\.test|https://marcobarberi.com|g" {} +',
        // 'minify_html' => 'find dist -type f -name "*.html" -exec sh -c \'tr -d "\n" < "$1" > "$1.tmp" && mv "$1.tmp" "$1"\' _ {} \;',
        /*
         * The films stream from Vimeo, so the MP4s in `public/video` are no
         * longer part of the site — only the poster JPGs next to them are.
         * `exclude_file_patterns` above keeps the MP4s out of the export.
         */
        // 'deploy' => '/usr/local/bin/netlify deploy --prod',
    ],

];
