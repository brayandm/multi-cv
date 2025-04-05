<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quota extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payment_plan_id',
        'action',
        'quota',
        'frequency',
        'cumulative',
        'left',
        'max_left',
        'pending',
        'max_pending',
        'failed',
        'max_failed',
        'total_failed',
        'total_succeeded',
        'last_used_at',
        'last_reset_at',
    ];

    protected $casts = [
        'cumulative' => 'boolean',
        'last_used_at' => 'datetime',
        'last_reset_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
