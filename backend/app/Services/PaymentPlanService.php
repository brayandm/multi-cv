<?php

namespace App\Services;

use App\Models\Action;
use App\Models\PaymentPlan;
use App\Models\Quota;

class PaymentPlanService
{
    public static function getPlan($userId)
    {
        return PaymentPlan::where('user_id', $userId)
            ->orderBy('priority', 'desc')
            ->first();
    }

    public static function paymentPlanExpired($userId)
    {
        $paymentPlan = self::getPlan($userId);

        if (! $paymentPlan) {
            return false;
        }

        if ($paymentPlan->name === 'occasional') {
            $quota = Quota::where('payment_plan_id', $paymentPlan->id)
                ->where('user_id', $userId)
                ->where('action', 'generate_cv_inline')
                ->first();

            return $quota && $quota->left === 0;
        }

        return $paymentPlan->expires_at && $paymentPlan->expires_at < now();
    }

    public function deletePaymentPlanAndQuotas($userId)
    {
        $paymentPlan = self::getPlan($userId);

        Action::where('user_id', $userId)
            ->where('payment_plan_id', $paymentPlan->id)
            ->delete();

        Quota::where('user_id', $userId)
            ->where('payment_plan_id', $paymentPlan->id)
            ->delete();

        $paymentPlan->delete();
    }

    public static function isFreemium($userId)
    {
        $paymentPlan = self::getPlan($userId);

        if (! $paymentPlan) {
            return false;
        }

        return $paymentPlan->name === 'freemium';
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
            'name' => 'freemium',
            'price' => 0,
            'description' => 'Freemium Plan',
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
            'max_failed' => 5,
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

    public static function createOccasionalPlan($userId)
    {
        $paymentPlan = PaymentPlan::create([
            'name' => 'occasional',
            'price' => 1.99,
            'description' => 'Occasional Plan',
            'user_id' => $userId,
            'priority' => 2,
        ]);

        Quota::create([
            'user_id' => $userId,
            'payment_plan_id' => $paymentPlan->id,
            'action' => 'generate_cv_inline',
            'quota' => 0,
            'frequency' => 'onetime',
            'cumulative' => false,
            'left' => 10,
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
            'left' => 50,
            'max_failed' => 5,
            'max_pending' => 1,
        ]);
    }

    public static function createDaily15Plan($userId)
    {
        $now = now();

        $paymentPlan = PaymentPlan::create([
            'name' => 'daily_15',
            'price' => 9.99,
            'description' => 'Daily 15 Plan',
            'user_id' => $userId,
            'priority' => 3,
            'expires_at' => $now->addMonth(),
        ]);

        Quota::create([
            'user_id' => $userId,
            'payment_plan_id' => $paymentPlan->id,
            'action' => 'generate_cv_inline',
            'quota' => 0,
            'frequency' => 'daily',
            'cumulative' => false,
            'left' => 15,
            'max_failed' => 3,
            'max_pending' => 1,
            'last_reset_at' => $now,
            'expires_at' => $now->addMonth(),
        ]);

        Quota::create([
            'user_id' => $userId,
            'payment_plan_id' => $paymentPlan->id,
            'action' => 'chat',
            'quota' => 0,
            'frequency' => 'onetime',
            'cumulative' => false,
            'left' => 50,
            'max_failed' => 5,
            'max_pending' => 1,
            'last_reset_at' => $now,
            'expires_at' => $now->addMonth(),
        ]);
    }
}
