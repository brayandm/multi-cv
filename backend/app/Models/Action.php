<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Action extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payment_plan_id',
        'action',
        'action_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
