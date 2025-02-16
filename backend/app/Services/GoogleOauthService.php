<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GoogleOauthService
{
    private string $clientId;

    private string $clientSecret;

    private string $redirectUri;

    private string $authUrl = 'https://accounts.google.com/o/oauth2/auth';

    private string $tokenUrl = 'https://oauth2.googleapis.com/token';

    private string $userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';

    /**
     * Constructor: Initializes the Google OAuth configuration using Laravel's config system.
     */
    public function __construct()
    {
        $this->clientId = config('services.google.client_id');
        $this->clientSecret = config('services.google.client_secret');
        $this->redirectUri = config('services.google.redirect');
    }

    /**
     * Generates the Google authentication URL where the user will be redirected to log in.
     *
     * @return string The Google OAuth authorization URL.
     */
    public function getAuthUrl(): string
    {
        return "{$this->authUrl}?".http_build_query([
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'response_type' => 'code', // Google will return an authorization code
            'scope' => 'email profile', // Request access to user's email and profile
            'access_type' => 'offline', // Allows getting a refresh token
            'prompt' => 'consent', // Ensures the user sees the consent screen
        ]);
    }

    /**
     * Exchanges the authorization code for an access token.
     *
     * @param  string  $code The authorization code received from Google.
     * @return array|null The access token data or null on failure.
     */
    public function getAccessToken(string $code): ?array
    {
        $response = Http::asForm()->post($this->tokenUrl, [
            'code' => $code,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'redirect_uri' => $this->redirectUri,
            'grant_type' => 'authorization_code',
        ]);

        return $response->successful() ? $response->json() : null;
    }

    /**
     * Retrieves user information from Google using the access token.
     *
     * @param  string  $accessToken The access token obtained from Google.
     * @return array|null User profile data or null on failure.
     */
    public function getUserInfo(string $accessToken): ?array
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$accessToken}",
        ])->get($this->userInfoUrl);

        return $response->successful() ? $response->json() : null;
    }
}
