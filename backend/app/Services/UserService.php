<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function createUser($data)
    {
        $user = User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
            'accepted_terms_at' => Carbon::now(),
        ]);

        event(new Registered($user));

        return $user;
    }

    public function createUserToken(User $user)
    {
        $user->tokens()->delete();

        return $user->createToken(config('auth.cookie_name'), [], Carbon::now()->addSeconds(config('auth.token_expiration')));
    }

    public function getUserToken($user)
    {
        return $user->tokens()->first();
    }

    public function findUserByEmail($email)
    {
        return User::where('email', $email)->firstOrFail();
    }

    public function findUserById($id)
    {
        return User::where('id', $id)->firstOrFail();
    }

    public function isCredentialsCorrect($data)
    {
        return Auth::attempt($data->only('email', 'password'));
    }

    public function deleteUserTokenById($user, $tokenId)
    {
        $user->tokens()->where('id', $tokenId)->delete();
    }

    public function deleteAllUserTokens($user)
    {
        $user->tokens()->delete();
    }

    public function updateProfile($user, $data)
    {
        $user->update([
            'name' => $data->name,
            'email' => $data->email,
        ]);

        return $user;
    }

    public function updatePassword($user, $data)
    {
        $user->update([
            'password' => Hash::make($data->password),
        ]);

        return $user;
    }
}
