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

        if (!$paymentsPlan) {
            return null;
        }

        $paymentPlanId = $paymentsPlan->id;

        $quotaQuery = Quota::where('payment_plan_id', $paymentPlanId)
                    ->where('user_id', $userId)
                    ->where('action', $action);

        if ($lock) {
            $quotaQuery->lockForUpdate();
        }

        return  $quotaQuery->first();
    }
}
