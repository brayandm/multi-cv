<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;

class ResponseHelper
{
    /**
     * Add the authentication cookie to the response.
     *
     * @param Response|JsonResponse|RedirectResponse $response
     * @param string $token
     * @return Response|JsonResponse|RedirectResponse
     */
    public static function addAuthCookie($response, $token)
    {
        $cookieName = config('auth.cookie_name');
        $expiration = config('auth.token_expiration') / 60; // Convert seconds to minutes

        return $response->cookie(
            $cookieName,
            $token,
            $expiration,
            '/',
            null,
            true, // Secure
            true, // HttpOnly
            false, // Raw
            'None' // SameSite
        );
    }
}
