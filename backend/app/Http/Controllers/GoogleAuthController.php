<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\GoogleOauthService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    private GoogleOauthService $googleService;

    public function __construct(GoogleOauthService $googleService)
    {
        $this->googleService = $googleService;
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
            ]
        );

        $user->update(['auth_token' => Str::random(60)]);

        return response()->json(['email' => $user->email,
            'auth_token' => $user->auth_token,
            'privacy_policy_accept' => $user->privacy_policy_accept,
            'message' => 'Successfully logged in!']);
    }
}
