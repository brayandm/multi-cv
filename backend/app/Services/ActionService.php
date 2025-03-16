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
    /**
     * Consumes an action from the user's quota.
     *
     * @return bool Indicates whether the operation was successful.
     */
    public function consumeAction(int $user_id, string $action): ?string
    {
        try {
            return DB::transaction(function () use ($user_id, $action) {
                $quota = Quota::where('user_id', $user_id)
                    ->where('action', $action)
                    ->lockForUpdate()
                    ->first();

                if (! $quota || $quota->left <= 0) {
                    return null;
                }

                if ($quota->max_pending != -1 && $quota->pending >= $quota->max_pending) {
                    return null;
                }

                $action = Action::create([
                    'user_id' => $user_id,
                    'action' => $action,
                    'action_id' => Str::uuid(),
                ]);

                $quota->decrement('left', 1, [
                    'last_used_at' => now(),
                ]);

                $quota->increment('pending');

                return $action->action_id;
            });
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return null;
        }
    }

    /**
     * Rolls back the consumption of an action from the user's quota.
     *
     * @return bool Indicates whether the rollback was successful.
     */
    public function rollbackAction(int $user_id, string $action): bool
    {
        try {
            return DB::transaction(function () use ($user_id, $action) {
                $quota = Quota::where('user_id', $user_id)
                    ->where('action', $action)
                    ->lockForUpdate()
                    ->first();

                if (! $quota || $quota->left >= $quota->quota) {
                    return false;
                }

                if ($quota->failed < $quota->max_failed || $quota->max_failed === -1) {
                    $quota->increment('left');
                }

                $quota->increment('failed');

                return true;
            });
        } catch (\Exception $e) {
            Log::error($e->getMessage());

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
                $quota = Quota::where('user_id', $user_id)
                    ->where('action', $action)
                    ->lockForUpdate()
                    ->first();

                if (! $quota) {
                    return false; // No quota record found
                }

                $lastReset = $quota->last_reset_at
                ? Carbon::parse($quota->last_reset_at)
                : Carbon::parse($quota->created_at);

                $now = Carbon::now();

                if ($this->shouldResetQuota($quota->frequency, $lastReset, $now)) {
                    $missedPeriods = $this->getMissedResetPeriods($quota->frequency, $lastReset, $now);

                    $newLeft = $quota->cumulative
                        ? min($quota->left + ($missedPeriods * $quota->quota), $quota->max_left) // Accumulate up to max_left
                        : $quota->quota; // Reset quota to default

                    $quota->update([
                        'left' => $newLeft,
                        'last_reset_at' => $now,
                    ]);
                }

                return true;
            });
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return false;
        }
    }

    /**
     * Determines the number of missed reset periods since last_reset_at.
     */
    private function getMissedResetPeriods(string $frequency, Carbon $lastReset, Carbon $now): int
    {
        switch ($frequency) {
            case 'minutes':
                return $lastReset->diffInMinutes($now);
            case 'hours':
                return $lastReset->diffInHours($now);
            case 'days':
                return $lastReset->diffInDays($now);
            case 'weeks':
                return $lastReset->diffInWeeks($now);
            case 'months':
                return $lastReset->diffInMonths($now);
            case 'years':
                return $lastReset->diffInYears($now);
            case 'onetime':
                return 0; // One-time quotas do not reset
            default:
                return 0;
        }
    }

    /**
     * Determines if the quota should be reset based on frequency.
     */
    private function shouldResetQuota(string $frequency, Carbon $lastReset, Carbon $now): bool
    {
        // If at least one period has passed, reset the quota
        $missedPeriods = $this->getMissedResetPeriods($frequency, $lastReset, $now);

        return $missedPeriods > 0;
    }
}
