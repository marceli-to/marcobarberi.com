<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'landing')->name('landing');
Route::view('/about', 'about')->name('about');
Route::view('/contact', 'contact')->name('contact');

// Vimeo delivery test — same showcases, streamed from Vimeo instead of the
// self-hosted MP4s. Not linked from anywhere in the public navigation.
// Two variants sharing one view, differing only in how the next film is
// prepared while the current one plays.
Route::view('/vimeo', 'landing-vimeo', ['preload' => false])->name('landing.vimeo');
Route::view('/vimeo-preload', 'landing-vimeo', ['preload' => true])->name('landing.vimeo.preload');
