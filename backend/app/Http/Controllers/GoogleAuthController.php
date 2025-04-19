<?php

namespace App\Http\Controllers;

use App\Helpers\CookiesHelper;
use App\Models\User;
use App\Services\GoogleOauthService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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
            ['email' => 'admin@multicv.space'],
            [
                'name' => 'Admin',
                'email_verified_at' => now(),
            ]
        );

        $token = $this->userService->createUserToken($user);

        return CookiesHelper::addAuthCookie(response()->json(['is_local' => true]), $token);
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

        $user = User::where('email', $userInfo['email'])->first();

        $userDeleted = User::onlyTrashed()
            ->where('email', $userInfo['email'])
            ->first();

        if (! $user) {
            if($userDeleted)
            {
                $user = $userDeleted;

                $user->restore();

                $user->update([
                    'first_name' => $userInfo['given_name'] ?? '',
                    'last_name' => $userInfo['family_name'] ?? '',
                    'email_verified_at' => now(),
                ]);
            }
            else
            {
                $user = User::Create([
                    'email' => $userInfo['email'],
                    'first_name' => $userInfo['given_name'] ?? '',
                    'last_name' => $userInfo['family_name'] ?? '',
                    'email_verified_at' => now(),
                ]);
            }

            if (isset($userInfo['picture'])) {
                $response = Http::head($userInfo['picture']);
                $contentType = $response->header('Content-Type');

                $fileExtension = match ($contentType) {
                    'image/jpeg', 'image/jpg' => 'jpg',
                    'image/png' => 'png',
                    'image/gif' => 'gif',
                    'image/webp' => 'webp',
                    'image/bmp' => 'bmp',
                    'image/svg+xml' => 'svg',
                    'image/x-icon', 'image/vnd.microsoft.icon' => 'ico',
                    'image/tiff' => 'tiff',
                    default => 'jpg',
                };

                $user->clearMediaCollection('profile_picture');

                $user->addMediaFromUrl($userInfo['picture'])
                    ->usingFileName("profile_picture.$fileExtension")
                    ->toMediaCollection('profile_picture');
            }
        }

        $token = $this->userService->createUserToken($user);

        if ($extension) {
            return CookiesHelper::addAuthCookie(redirect(config('app.frontend_url').'/redirect-back?extension=true'), $token);
        }

        return CookiesHelper::addAuthCookie(redirect(config('app.frontend_url').'/redirect-back'), $token);
    }
}
