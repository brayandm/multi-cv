<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class EmailVerificationController extends Controller
{
    public function verify(Request $request)
    {
        if (! $request->hasValidSignature()) {
            return redirect()->to(config('app.frontend_url') . '/email/verify/expired');
        }

        $userId = $request->query('id');
        info("User ID: {$userId}");
        $user = User::findOrFail($userId);

        if ($user->hasVerifiedEmail()) {
            return redirect()->to(config('app.frontend_url') . '/email/verify/already-verified');
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        return redirect()->to(config('app.frontend_url') . '/email/verify/success');
    }

    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'The email has already been verified.'], 200);
        }

        $action = 'resend-verification-email';
        $userId = $request->user()->id;

        if (! $userId) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        RateLimiter::attempt(
            "{$action}:{$userId}",
            3,
            function () {
                return true;
            },
            60 * 60 * 24
        ) || throw ValidationException::withMessages([
            'error' => 'You have exceeded the registration limit per User ID. Please try again later.',
        ])->status(429);

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification email resent.']);
    }
}
