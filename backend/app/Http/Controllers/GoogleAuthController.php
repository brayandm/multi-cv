<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\GoogleOauthService;
use App\Services\UserService;
use Illuminate\Http\Request;

class GoogleAuthController extends Controller
{
    private GoogleOauthService $googleService;
    private UserService $userService;

    public function __construct(GoogleOauthService $googleService, UserService $userService)
    {
        $this->googleService = $googleService;
        $this->userService = $userService;
    }

    public function redirectToGoogle()
    {
        $authUrl = $this->googleService->getAuthUrl();

        return response()->json(['url' => $authUrl]);
    }

    public function handleGoogleCallback(Request $request)
    {
        $code = $request->query('code');

        if (! $code) {
            return redirect('/')->with('error', 'Authorization code not received.');
        }

        $tokenData = $this->googleService->getAccessToken($code);

        if (! $tokenData) {
            return redirect('/')->with('error', 'Failed to get Google access token.');
        }

        $userInfo = $this->googleService->getUserInfo($tokenData['access_token']);

        if (! $userInfo) {
            return redirect('/')->with('error', 'Failed to retrieve user information.');
        }

        $user = User::firstOrCreate(
            ['email' => $userInfo['email']],
            [
                'name' => $userInfo['name'],
                'email_verified_at' => now(),
                'privacy_policy_accept' => false,
            ]
        );

        $token = $this->userService->createUserToken($user);

        return redirect(config('app.frontend_url') . '/home')
            ->cookie('auth_token', $token->plainTextToken, config('auth.token_expiration'), '/', null, true, true, false, 'None');
    }
}
