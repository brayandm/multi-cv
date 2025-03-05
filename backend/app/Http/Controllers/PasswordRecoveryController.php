<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class PasswordRecoveryController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        Password::resetUrl(function ($notifiable, $token) {
            return config('app.frontend_url') . "/password/recovery/new?token={$token}&email=" . urlencode($notifiable->email);
        });

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Reset link sent successfully.'])
            : response()->json(['message' => 'Error sending reset link.'], 400);
    }

    public function redirectToResetPassword(Request $request)
    {
        $token = request()->query('token');
        $email = request()->query('email');

        if (!$token || !$email) {
            abort(400, 'Invalid reset link');
        }

        return redirect(config('app.frontend_url') . "/password/recovery/new?token={$token}&email={$email}");
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required',
            'password' => 'required|min:6|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Password reset successfully.'])
            : response()->json(['message' => 'Invalid or expired token.'], 400);
    }
}
