<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Stripe\Checkout\Session;
use Stripe\PromotionCode;
use Stripe\Stripe;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payment_plan_id',
        'amount_total',
        'amount_paid',
        'amount_discount',
        'currency',
        'promotion_code',
        'session_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paymentPlan()
    {
        return $this->belongsTo(PaymentPlan::class);
    }

    public static function fromStripeSession(Session $session, int $userId, int $paymentPlanId): self
    {
        $amountPaid = $session->amount_total;
        $amountDiscount = $session->total_details->amount_discount ?? 0;
        $amountTotal = $amountPaid + $amountDiscount;

        $promotionCodeId = $session->discounts[0]->promotion_code ?? null;
        $promotionCode = null;

        Stripe::setApiKey(config('services.stripe.secret'));

        if ($promotionCodeId) {
            $promotion = PromotionCode::retrieve($promotionCodeId);
            $promotionCode = $promotion->code;
        }

        return self::create([
            'user_id' => $userId,
            'payment_plan_id' => $paymentPlanId,
            'amount_total' => $amountTotal,
            'amount_paid' => $amountPaid,
            'amount_discount' => $amountDiscount,
            'currency' => $session->currency,
            'promotion_code' => $promotionCode,
            'session_id' => $session->id,
        ]);
    }
}
