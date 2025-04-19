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
            'first_name' => $data->first_name,
            'last_name' => $data->last_name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
            'is_in_talent_pool' => (bool) $data->talent_pool,
            'accepted_terms_at' => Carbon::now(),
        ]);

        event(new Registered($user));

        return $user;
    }

    public function createUserToken(User $user)
    {
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
        $previousEmail = $user->email;

        $user->update([
            'first_name' => $data->first_name,
            'last_name' => $data->last_name,
            'email' => $data->email,
        ]);

        if($previousEmail !== $data->email) {
            $user->email_verified_at = null;
            $user->save();
        }

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
