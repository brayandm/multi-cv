<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'accepted_terms_at',
        'notified_terms_at',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'accepted_terms_at' => 'datetime',
        'notified_terms_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            $request = request();
            $action = 'register';

            RateLimiter::attempt(
                "{$action}:ip:{$request->ip()}",
                10,
                function () {
                    return true;
                },
                60 * 60 * 24
            ) || throw ValidationException::withMessages([
                'error' => 'You have exceeded the registration limit per IP. Please try again later.',
            ])->status(429);

            RateLimiter::attempt(
                "{$action}:global",
                100,
                function () {
                    return true;
                },
                60 * 60 * 24
            ) || throw ValidationException::withMessages([
                'error' => 'You have exceeded the global registration limit. Please try again later.',
            ])->status(429);
        });
    }
}
