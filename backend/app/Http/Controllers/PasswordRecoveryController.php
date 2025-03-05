<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

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

        if($status === Password::PASSWORD_RESET)
        {
            $user = User::where('email', $request->email)->first();

            $token = $this->userService->createUserToken($user);

            return response()->json(['message' => 'Password reset successfully.'])
                ->cookie(config('auth.cookie_name'), $token->plainTextToken, config('auth.token_expiration') / 60, '/', null, true, true, false, 'None');
        }

        return response()->json(['message' => 'Invalid or expired token.'], 400);
    }
}
