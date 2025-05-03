<?php

namespace App\Services;

use App\Models\Action;
use App\Models\Quota;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ActionService
{
    protected PaymentPlanService $paymentPlanService;

    public function __construct(PaymentPlanService $paymentPlanService)
    {
        $this->paymentPlanService = $paymentPlanService;
    }

    private function getQuota($user_id, $action, $lock = false)
    {
        return $this->paymentPlanService->getQuota($user_id, $action, $lock);
    }

    private function paymentPlanExpired($user_id)
    {
        return $this->paymentPlanService->paymentPlanExpired($user_id);
    }

    private function deletePaymentPlanAndQuotas($user_id)
    {
        $this->paymentPlanService->deletePaymentPlanAndQuotas($user_id);
    }

    private function getPlanId($user_id)
    {
        $paymentPlan = $this->paymentPlanService->getPlan($user_id);

        if (! $paymentPlan) {
            return null;
        }

        return $paymentPlan->id;
    }

    /**
     * Consumes an action from the user's quota.
     *
     * @return string|null Returns the action_id if the action was consumed successfully, null otherwise.
     */
    public function consumeAction(int $user_id, string $action): ?string
    {
        try {
            return DB::transaction(function () use ($user_id, $action) {

                $quota = $this->getQuota($user_id, $action, true);

                if ($this->paymentPlanExpired($user_id)) {
                    $this->deletePaymentPlanAndQuotas($user_id);

                    return null;
                }

                if ($this->isQuotaFinished($quota)) {
                    return null;
                }

                $lastReset = $quota->last_reset_at
                    ? Carbon::parse($quota->last_reset_at)
                    : Carbon::parse($quota->created_at);

                $expiresAt = $quota->expires_at ? Carbon::parse($quota->expires_at) : null;

                if ($this->shouldResetQuota($quota->frequency, $lastReset, Carbon::now(), $expiresAt)) {
                    $result = $this->resetQuota($user_id, $action);

                    if (! $result) {
                        return null;
                    }

                    $quota = $this->getQuota($user_id, $action, true);
                }

                if (! $quota || $quota->left <= 0) {
                    return null;
                }

                if ($quota->max_pending != -1 && $quota->pending >= $quota->max_pending) {

                    $result = $this->cleanupUserPendingActions($user_id, $action);

                    if (! $result) {
                        return null;
                    }

                    $quota = $this->getQuota($user_id, $action, true);

                    if (! $quota || $quota->pending >= $quota->max_pending) {
                        return null;
                    }
                }

                $actionRecord = Action::create([
                    'user_id' => $user_id,
                    'payment_plan_id' => $this->getPlanId($user_id),
                    'action' => $action,
                    'action_id' => Str::uuid(),
                ]);

                $newLeft = $quota->left - 1;
                $newPending = $quota->pending + 1;

                $quota->update([
                    'left' => $newLeft,
                    'pending' => $newPending,
                    'last_used_at' => Carbon::now(),
                ]);

                return $actionRecord->action_id;
            });
        } catch (\Throwable $e) {
            Log::error($e->getMessage());

            return null;
        }
    }

    /**
     * Rolls back the consumption of an action from the user's quota.
     *
     * @return bool Indicates whether the rollback was successful.
     */
    public function rollbackAction(string $action_id): bool
    {
        try {
            return DB::transaction(function () use ($action_id) {
                $actionRecord = Action::where('action_id', $action_id)
                    ->lockForUpdate()
                    ->first();

                if (! $actionRecord) {
                    return true;
                }

                $action = $actionRecord->action;
                $user_id = $actionRecord->user_id;

                $actionRecord->delete();

                $quota = $this->getQuota($user_id, $action, true);

                if (! $quota) {
                    return true;
                }

                $newLeft = $quota->left;

                if ($quota->failed < $quota->max_failed || $quota->max_failed === -1) {
                    $newLeft = $quota->left + 1;
                }

                $newPending = max(0, $quota->pending - 1);
                $newFailed = $quota->failed + 1;
                $newTotalFailed = $quota->total_failed + 1;

                $quota->update([
                    'left' => $newLeft,
                    'pending' => $newPending,
                    'failed' => $newFailed,
                    'total_failed' => $newTotalFailed,
                ]);

                return true;
            });
        } catch (\Throwable $e) {
            Log::error($e->getMessage());

            return false;
        }
    }

    /**
     * Cancels the consumption of an action from the user's quota.
     *
     * @return bool Indicates whether the cancellation was successful.
     */
    public function cancelAction(string $action_id): bool
    {
        try {
            return DB::transaction(function () use ($action_id) {
                $actionRecord = Action::where('action_id', $action_id)
                    ->lockForUpdate()
                    ->first();

                if (! $actionRecord) {
                    return true;
                }

                $action = $actionRecord->action;
                $user_id = $actionRecord->user_id;

                $actionRecord->delete();

                $quota = $this->getQuota($user_id, $action, true);

                if (! $quota) {
                    return true;
                }

                $newLeft = $quota->left + 1;

                $newPending = max(0, $quota->pending - 1);

                $quota->update([
                    'left' => $newLeft,
                    'pending' => $newPending,
                ]);

                return true;
            });
        } catch (\Throwable $e) {
            Log::error($e->getMessage());

            return false;
        }
    }

    /**
     * Commits the consumption of an action from the user's quota.
     *
     * @return bool Indicates whether the commit was successful.
     */
    public function commitAction(string $action_id): bool
    {
        try {
            return DB::transaction(function () use ($action_id) {
                $actionRecord = Action::where('action_id', $action_id)
                    ->lockForUpdate()
                    ->first();

                if (! $actionRecord) {
                    return false;
                }

                $action = $actionRecord->action;
                $user_id = $actionRecord->user_id;

                $actionRecord->delete();

                $quota = $this->getQuota($user_id, $action, true);

                if (! $quota) {
                    return false;
                }

                $newPending = max(0, $quota->pending - 1);
                $newTotalSucceeded = $quota->total_succeeded + 1;

                $quota->update([
                    'pending' => $newPending,
                    'total_succeeded' => $newTotalSucceeded,
                ]);

                return true;
            });
        } catch (\Throwable $e) {
            Log::error($e->getMessage());

            return false;
        }
    }

    /**
     * Cleans up pending actions for a specific user and action that are older than 5 minutes.
     *
     * @return bool Returns true if the cleanup was successful, false otherwise.
     */
    public function cleanupUserPendingActions(int $user_id, string $action): bool
    {
        try {
            return DB::transaction(function () use ($user_id, $action) {

                $threshold = Carbon::now()->subMinutes(5);

                $actionRecords = Action::where('payment_plan_id', $this->getPlanId($user_id))
                    ->where('user_id', $user_id)
                    ->where('action', $action)
                    ->where('created_at', '<', $threshold)
                    ->get();

                if ($actionRecords->isEmpty()) {
                    return true;
                }

                $count = $actionRecords->count();

                Action::whereIn('id', $actionRecords->pluck('id'))->delete();

                $quota = $this->getQuota($user_id, $action, true);

                if ($quota) {
                    $newPending = max(0, $quota->pending - $count);
                    $newFailed = $quota->failed + $count;

                    if ($quota->max_failed != -1) {
                        $leftToIncrement = min($newFailed, $quota->max_failed) - $quota->failed;
                    } else {
                        $leftToIncrement = $count;
                    }

                    $newLeft = $quota->left + $leftToIncrement;
                    $newTotalFailed = $quota->total_failed + $count;

                    $quota->update([
                        'left' => $newLeft,
                        'pending' => $newPending,
                        'failed' => $newFailed,
                        'total_failed' => $newTotalFailed,
                    ]);
                }

                return true;
            });
        } catch (\Throwable $e) {
            Log::error("Error cleaning up user pending actions: {$e->getMessage()}");

            return false;
        }
    }

    /**
     * Resets the user's quota based on frequency.
     *
     * @return bool Indicates whether the reset was successful.
     */
    public function resetQuota(int $user_id, string $action): bool
    {
        try {
            return DB::transaction(function () use ($user_id, $action) {
                $quota = $this->getQuota($user_id, $action, true);

                if (! $quota) {
                    return false;
                }

                if ($this->paymentPlanExpired($user_id)) {
                    $this->deletePaymentPlanAndQuotas($user_id);

                    return false;
                }

                if ($this->isQuotaFinished($quota)) {
                    $quota->update([
                        'left' => 0,
                        'failed' => 0,
                    ]);

                    return true;
                }

                $lastReset = $quota->last_reset_at
                    ? Carbon::parse($quota->last_reset_at)
                    : Carbon::parse($quota->created_at);

                $now = Carbon::now();

                $expiresAt = $quota->expires_at ? Carbon::parse($quota->expires_at) : null;

                if ($this->shouldResetQuota($quota->frequency, $lastReset, $now, $expiresAt)) {
                    $missedPeriods = $this->getMissedResetPeriods($quota->frequency, $lastReset, $now, $expiresAt);

                    $newLeft = $quota->cumulative
                        ? min($quota->left + ($missedPeriods * $quota->quota), $quota->max_left) // Accumulate up to max_left
                        : $quota->quota; // Reset quota to default

                    $newLastReset = $this->calculateNewLastReset($quota->frequency, $lastReset, $missedPeriods);

                    $quota->update([
                        'left' => $newLeft,
                        'failed' => 0,
                        'last_reset_at' => $newLastReset,
                    ]);
                }

                return true;
            });
        } catch (\Throwable $e) {
            Log::error($e->getMessage());

            return false;
        }
    }

    /**
     * Calculates the new last reset timestamp based on missed periods.
     */
    private function calculateNewLastReset(string $frequency, Carbon $lastReset, int $missedPeriods): Carbon
    {
        switch ($frequency) {
            case 'minutes':
                return $lastReset->copy()->addMinutes($missedPeriods);
            case 'hours':
                return $lastReset->copy()->addHours($missedPeriods);
            case 'days':
                return $lastReset->copy()->addDays($missedPeriods);
            case 'weeks':
                return $lastReset->copy()->addWeeks($missedPeriods);
            case 'months':
                return $lastReset->copy()->addMonths($missedPeriods);
            case 'years':
                return $lastReset->copy()->addYears($missedPeriods);
            case 'onetime':
            default:
                return $lastReset;
        }
    }

    /**
     * Determines the number of missed reset periods since last_reset_at.
     */
    private function getMissedResetPeriods(string $frequency, Carbon $lastReset, Carbon $now, ?Carbon $expiresAt = null): int
    {
        if ($expiresAt && $expiresAt->lte($now)) {
            $effectiveDate = $this->subtractOnePeriod($expiresAt, $frequency);
        } else {
            $effectiveDate = $now;
        }

        switch ($frequency) {
            case 'minutes':
                return $lastReset->diffInMinutes($effectiveDate);
            case 'hours':
                return $lastReset->diffInHours($effectiveDate);
            case 'days':
                return $lastReset->diffInDays($effectiveDate);
            case 'weeks':
                return $lastReset->diffInWeeks($effectiveDate);
            case 'months':
                return $lastReset->diffInMonths($effectiveDate);
            case 'years':
                return $lastReset->diffInYears($effectiveDate);
            case 'onetime':
                return 0; // One-time quotas do not reset
            default:
                return 0;
        }
    }

    /**
     * Subtracts one period from the given date based on the frequency.
     */
    private function subtractOnePeriod(Carbon $date, string $frequency): Carbon
    {
        return match ($frequency) {
            'minutes' => $date->copy()->subMinute(),
            'hours' => $date->copy()->subHour(),
            'days' => $date->copy()->subDay(),
            'weeks' => $date->copy()->subWeek(),
            'months' => $date->copy()->subMonth(),
            'years' => $date->copy()->subYear(),
            default => $date->copy(),
        };
    }

    /**
     * Determines if the quota is finished based on the left count.
     */
    private function isQuotaFinished($quota): bool
    {
        $expiresAt = $quota->expires_at ? Carbon::parse($quota->expires_at) : null;

        if (Carbon::now()->gte($quota->expires_at)) {
            return true;
        }

        if (is_null($expiresAt)) {
            return $quota->frequency === 'onetime' && $quota->left === 0;
        }

        $lastReset = $quota->last_reset_at
            ? Carbon::parse($quota->last_reset_at)
            : Carbon::parse($quota->created_at);

        $missedPeriods = $this->getMissedResetPeriods($quota->frequency, $lastReset, $expiresAt, $expiresAt);

        return $missedPeriods === 0 && $quota->left === 0;
    }

    /**
     * Determines if the quota should be reset based on frequency.
     */
    private function shouldResetQuota(string $frequency, Carbon $lastReset, Carbon $now, ?Carbon $expiresAt = null): bool
    {
        $missedPeriods = $this->getMissedResetPeriods($frequency, $lastReset, $now, $expiresAt);

        return $missedPeriods > 0;
    }

    public function getQuotaInfo(int $user_id, string $action): ?array
    {
        $quota = $this->getQuota($user_id, $action);

        if (! $quota) {
            return null;
        }

        $lastReset = $quota->last_reset_at
            ? Carbon::parse($quota->last_reset_at)
            : Carbon::parse($quota->created_at);

        $expiresAt = $quota->expires_at ? Carbon::parse($quota->expires_at) : null;

        if ($this->shouldResetQuota($quota->frequency, $lastReset, Carbon::now(), $expiresAt)) {
            $result = $this->resetQuota($user_id, $action);

            if (! $result) {
                throw new \Exception('Failed to reset quota');
            }

            $quota = $this->getQuota($user_id, $action);
        }

        if ($this->paymentPlanExpired($user_id)) {
            $this->deletePaymentPlanAndQuotas($user_id);

            $quota = $this->getQuota($user_id, $action);
        }

        $isQuotaFinished = $this->isQuotaFinished($quota);

        return [
            'quota' => $quota->quota,
            'frequency' => $quota->frequency,
            'left' => $isQuotaFinished ? 0 : $quota->left,
            'pending' => $quota->pending,
            'max_pending' => $quota->max_pending,
            'finished' => $isQuotaFinished,
            'is_freemium' => $this->paymentPlanService->isFreemium($user_id),
        ];
    }

    public function getAction(string $action_id): ?array
    {
        $action = Action::where('action_id', $action_id)
            ->first();

        if (! $action) {
            return null;
        }

        return [
            'action_id' => $action->action_id,
            'user_id' => $action->user_id,
            'payment_plan_id' => $action->payment_plan_id,
            'action' => $action->action,
            'created_at' => $action->created_at,
            'updated_at' => $action->updated_at,
        ];
    }
}
