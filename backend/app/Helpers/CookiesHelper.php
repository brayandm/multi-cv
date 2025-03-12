<?php

namespace App\Helpers;

use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Laravel\Sanctum\NewAccessToken;

class CookiesHelper
{
    /**
     * Add the authentication cookie to the response.
     *
     * @param  JsonResponse|RedirectResponse  $response
     * @param  NewAccessToken  $token
     * @return JsonResponse|RedirectResponse
     */
    public static function addAuthCookie($response, $token, $sendCookieData = false)
    {
        $cookieName = config('auth.cookie_name');
        $expiration = config('auth.token_expiration');
        $expirationDate = Carbon::now()->addSeconds($expiration)->timestamp;

        $finalResponse = $response->cookie(
            $cookieName,
            $token->plainTextToken,
            $expiration / 60, // Convert seconds to minutes
            '/',
            null,
            true, // Secure
            false, // HttpOnly
            false, // Raw
            'Strict' // SameSite
        );

        if(! $sendCookieData) {
            return $finalResponse;
        }

        if ($response instanceof RedirectResponse) {
            $url = $response->getTargetUrl();
            $queryParams = http_build_query([
                'name' => $cookieName,
                'value' => $token->plainTextToken,
                'expiration_date' => $expirationDate,
            ]);
            $separator = parse_url($url, PHP_URL_QUERY) ? '&' : '?';
            $response->setTargetUrl($url.$separator.$queryParams);

            return $finalResponse;
        } else {
            return $finalResponse->setData(array_merge($response->getData(true), [
                'auth_cookie' => [
                    'name' => $cookieName,
                    'value' => $token->plainTextToken,
                    'expiration_date' => $expirationDate,
                ],
            ]));
        }
    }
}
