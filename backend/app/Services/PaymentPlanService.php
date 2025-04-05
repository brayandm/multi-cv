<?php

namespace App\Services;

use App\Models\PaymentPlan;
use App\Models\Quota;

class PaymentPlanService
{
    public function getPlan($userId)
    {
        return PaymentPlan::where('user_id', $userId)
            ->orderBy('priority', 'desc')
            ->first();
    }

    public function getQuota($userId, $action, $lock = false)
    {
        $paymentsPlan = PaymentPlan::where('user_id', $userId)
            ->orderBy('priority', 'desc')
            ->first();

        if (! $paymentsPlan) {
            return null;
        }

        $paymentPlanId = $paymentsPlan->id;

        $quotaQuery = Quota::where('payment_plan_id', $paymentPlanId)
            ->where('user_id', $userId)
            ->where('action', $action);

        if ($lock) {
            $quotaQuery->lockForUpdate();
        }

        return $quotaQuery->first();
    }

    public static function createFreemiumPlan($userId)
    {
        $paymentPlan = PaymentPlan::create([
            'name' => 'Freemium',
            'price' => 0,
            'description' => 'Freemium plan',
            'user_id' => $userId,
            'priority' => 1,
        ]);

        Quota::create([
            'user_id' => $userId,
            'payment_plan_id' => $paymentPlan->id,
            'action' => 'generate_cv_inline',
            'quota' => 3,
            'frequency' => 'months',
            'cumulative' => false,
            'left' => 3,
            'max_failed' => 3,
            'max_pending' => 1,
        ]);

        Quota::create([
            'user_id' => $userId,
            'payment_plan_id' => $paymentPlan->id,
            'action' => 'chat',
            'quota' => 0,
            'frequency' => 'onetime',
            'cumulative' => false,
            'left' => 20,
            'max_failed' => 10,
            'max_pending' => 1,
        ]);

        Quota::create([
            'user_id' => $userId,
            'payment_plan_id' => $paymentPlan->id,
            'action' => 'auto_fill_cv_from_document',
            'quota' => 0,
            'frequency' => 'onetime',
            'cumulative' => false,
            'left' => 1,
            'max_failed' => 1,
            'max_pending' => 1,
        ]);
    }
}
