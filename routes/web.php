<?php
use Illuminate\Support\Facades\Route;

Route::view('/', 'landing')->name('landing');
Route::view('/about', 'about')->name('about');
Route::view('/contact', 'contact')->name('contact');
