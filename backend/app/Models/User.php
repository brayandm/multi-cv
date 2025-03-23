<?php

namespace App\Models;

use App\Notifications\ResetPasswordQueued;
use App\Notifications\VerifyEmailQueued;
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
        'locale',
        'is_first_login',
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
        'is_first_login' => 'boolean',
    ];

    public function quotas()
    {
        return $this->hasMany(Quota::class);
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmailQueued);
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordQueued($token));
    }

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

        static::created(function ($user) {

            Quota::create([
                'user_id' => $user->id,
                'action' => 'generate_cv_inline',
                'quota' => 5,
                'frequency' => 'months',
                'cumulative' => false,
                'left' => 5,
                'max_failed' => 3,
                'max_pending' => 1,
            ]);

            Quota::create([
                'user_id' => $user->id,
                'action' => 'chat',
                'quota' => 0,
                'frequency' => 'onetime',
                'cumulative' => false,
                'left' => 100,
                'max_failed' => 10,
                'max_pending' => 1,
            ]);
        });
    }
}
