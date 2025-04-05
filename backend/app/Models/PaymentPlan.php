<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'description',
        'user_id',
        'priority',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'priority' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quotas()
    {
        return $this->hasMany(Quota::class);
    }
}
