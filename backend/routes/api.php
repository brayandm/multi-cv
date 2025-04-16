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

    Route::get('/ping', function () {
        return 'pong';
    });

    Route::post('/login', 'App\Http\Controllers\AuthController@login');

    Route::post('/register', 'App\Http\Controllers\AuthController@register');

    Route::get('/oauth/google/login', 'App\Http\Controllers\GoogleAuthController@redirectToGoogle');

    Route::get('/oauth/google/callback', 'App\Http\Controllers\GoogleAuthController@handleGoogleCallback');

    Route::get('/user-status', 'App\Http\Controllers\AuthController@userStatus');

    Route::post('/password/email', 'App\Http\Controllers\PasswordRecoveryController@sendResetLink');

    Route::get('/password/reset', 'App\Http\Controllers\PasswordRecoveryController@redirectToResetPassword')
        ->name('password.reset');

    Route::post('/password/reset', 'App\Http\Controllers\PasswordRecoveryController@resetPassword');

    Route::post('/stripe/webhook', 'App\Http\Controllers\PaymentController@handleWebhook');

    Route::middleware(['check.constant.connection', 'auth:sanctum', 'verified', 'auth.inter.communication'])->group(function () {
        Route::post('/action/consume', 'App\Http\Controllers\ActionController@consumeAction');
        Route::post('/auth/get-id', 'App\Http\Controllers\AuthController@getId');
    });

    Route::middleware(['auth.inter.communication'])->group(function () {
        Route::post('/action/rollback', 'App\Http\Controllers\ActionController@rollbackAction');
        Route::post('/action/cancel', 'App\Http\Controllers\ActionController@cancelAction');
        Route::post('/action/commit', 'App\Http\Controllers\ActionController@commitAction');

        Route::post('/suspend/account', 'App\Http\Controllers\AuthController@suspendAccount');
    });

    Route::middleware(['check.constant.connection', 'auth:sanctum'])->group(function () {

        Route::get('/email/verify', 'App\Http\Controllers\EmailVerificationController@verify')
            ->name('verification.verify');

        Route::post('/email/resend', 'App\Http\Controllers\EmailVerificationController@resend')
            ->name('verification.resend');

        Route::post('/logout', 'App\Http\Controllers\AuthController@logout');

        Route::post('/logoutall', 'App\Http\Controllers\AuthController@logoutall');

        Route::put('/user/set-locale', 'App\Http\Controllers\AuthController@updateLocale');
        Route::get('/user/locale', 'App\Http\Controllers\AuthController@getLocale');

        Route::put('/user/set-theme', 'App\Http\Controllers\AuthController@updateTheme');
        Route::get('/user/theme', 'App\Http\Controllers\AuthController@getTheme');
    });

    Route::middleware(['check.constant.connection', 'auth:sanctum', 'verified'])->group(function () {

        Route::post('/quota/info', 'App\Http\Controllers\ActionController@getQuotaInfo');

        Route::get('/user', 'App\Http\Controllers\AuthController@getUser');

        Route::put('/user/update/profile', 'App\Http\Controllers\AuthController@updateProfile');
        Route::put('/user/update/password', 'App\Http\Controllers\AuthController@updatePassword');

        Route::put('/user/talent-pool', 'App\Http\Controllers\AuthController@updateTalentPool');
        Route::put('/user/accept-terms-version', 'App\Http\Controllers\AuthController@updateAcceptedTermsVersion');
        Route::put('/user/notified-terms-version', 'App\Http\Controllers\AuthController@updateNotifiedTermsVersion');

        Route::put('/user/finish-first-login', 'App\Http\Controllers\AuthController@finishFirstLogin');

        Route::post('/user/upload/profile-picture', 'App\Http\Controllers\AuthController@uploadProfilePicture');
        Route::delete('/user/delete/profile-picture', 'App\Http\Controllers\AuthController@deleteProfilePicture');
        Route::get('/user/profile-picture', 'App\Http\Controllers\AuthController@getProfilePicture');

        Route::post('/checkout-session', 'App\Http\Controllers\PaymentController@createCheckoutSession');
    });
});
