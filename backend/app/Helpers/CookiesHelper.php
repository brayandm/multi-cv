<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Laravel\Sanctum\NewAccessToken;

class CookiesHelper
{
    /**
     * Add the authentication cookie to the response.
     *
     * @param  Response|JsonResponse|RedirectResponse  $response
     * @param  NewAccessToken  $token
     * @return Response|JsonResponse|RedirectResponse
     */
    public static function addAuthCookie($response, $token)
    {
        $cookieName = config('auth.cookie_name');
        $expiration = config('auth.token_expiration') / 60; // Convert seconds to minutes

        return $response->cookie(
            $cookieName,
            $token->plainTextToken,
            $expiration,
            '/',
            null,
            true, // Secure
            false, // HttpOnly
            false, // Raw
            'Strict' // SameSite
        );
    }
}
