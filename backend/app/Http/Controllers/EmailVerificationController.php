<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use App\Http\Controllers\Controller;

class EmailVerificationController extends Controller
{
    public function verify(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->to(config('app.frontend_url') . '/email/verify/already-verified');
        }

        if (!$request->hasValidSignature()) {
            return redirect()->to(config('app.frontend_url') . '/email/verify/expired');
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

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification email resent.']);
    }
}
