<?php

namespace App\Http\Controllers;

use App\Helpers\CookiesHelper;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class PasswordRecoveryController extends Controller
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255|exists:users,email',
        ]);

        $action = 'password-recovery';
        $userId = User::where('email', $request->email)->first()->id;

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

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Reset link sent successfully.'])
            : response()->json(['message' => 'Error sending reset link.'], 400);
    }

    public function redirectToResetPassword(Request $request)
    {
        $token = request()->query('token');
        $email = request()->query('email');

        if (! $token || ! $email) {
            abort(400, 'Invalid reset link');
        }

        return redirect(config('app.frontend_url')."/password/recovery/new?token={$token}&email={$email}");
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255|exists:users,email',
            'token' => 'required',
            'password' => 'required|string|min:8|max:255|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password reset successfully.'], 200);
        }

        return response()->json(['message' => 'Invalid or expired token.'], 400);
    }
}
