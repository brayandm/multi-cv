<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group(['prefix' => 'v1'], function () {

    Route::post('/login', 'App\Http\Controllers\AuthController@login');

    Route::post('/register', 'App\Http\Controllers\AuthController@register');

    Route::get('/oauth/google/login', 'App\Http\Controllers\GoogleAuthController@redirectToGoogle');

    Route::get('/oauth/google/callback', 'App\Http\Controllers\GoogleAuthController@handleGoogleCallback');

    Route::middleware(['check.constant.connection', 'auth:sanctum'])->group(function () {

        Route::get('/verify', 'App\Http\Controllers\AuthController@verify');

        Route::post('/logout', 'App\Http\Controllers\AuthController@logout');

        Route::post('/logoutall', 'App\Http\Controllers\AuthController@logoutall');

        Route::get('/user', 'App\Http\Controllers\AuthController@getUser');

        Route::put('/user/update/profile', 'App\Http\Controllers\AuthController@updateProfile');
        Route::put('/user/update/password', 'App\Http\Controllers\AuthController@updatePassword');
    });
});
