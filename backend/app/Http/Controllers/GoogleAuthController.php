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

    public function fakeLocalUser($extension = false)
    {
        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'John Doe',
                'email_verified_at' => now(),
            ]
        );

        $token = $this->userService->createUserToken($user);

        if ($extension) {
            return response()->json(['is_local' => true])
                ->cookie(config('auth.cookie_name'), $token->plainTextToken, config('auth.token_expiration') / 60, '/', null, true, true, false, 'None');
        }

        return response()->json(['is_local' => true])
            ->cookie(config('auth.cookie_name'), $token->plainTextToken, config('auth.token_expiration') / 60, '/', null, true, true, false, 'None');
    }

    public function redirectToGoogle(Request $request)
    {
        $extension = $request->query('extension');

        if (config('app.env') === 'local') {
            return $this->fakeLocalUser($extension);
        }

        $authUrl = $this->googleService->getAuthUrl($extension);

        return response()->json(['url' => $authUrl]);
    }

    public function handleGoogleCallback(Request $request)
    {
        $extension = $request->query('extension');
        $code = $request->query('code');

        if (! $code) {
            return redirect('/')->with('error', 'Authorization code not received.');
        }

        $tokenData = $this->googleService->getAccessToken($extension, $code);

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

        $token = $this->userService->createUserToken($user);

        if ($extension) {
            return redirect(config('app.frontend_url').'/redirect-back')
                ->cookie(config('auth.cookie_name'), $token->plainTextToken, config('auth.token_expiration') / 60, '/', null, true, true, false, 'None');
        }

        return redirect(config('app.frontend_url').'/home')
            ->cookie(config('auth.cookie_name'), $token->plainTextToken, config('auth.token_expiration') / 60, '/', null, true, true, false, 'None');
    }
}
