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
     * @return string|null Returns the action_id if the action was consumed successfully, null otherwise.
     */
    public function consumeAction(int $user_id, string $action): ?string
    {
        try {
            return DB::transaction(function () use ($user_id, $action) {
                $quota = Quota::where('user_id', $user_id)
                    ->where('action', $action)
                    ->lockForUpdate()
                    ->first();

                if ($this->shouldResetQuota($quota->frequency, $quota->last_reset_at, Carbon::now())) {
                    $result = $this->resetQuota($user_id, $action);

                    if (! $result) {
                        return null;
                    }

                    $quota = Quota::where('user_id', $user_id)
                        ->where('action', $action)
                        ->lockForUpdate()
                        ->first();
                }

                if (! $quota || $quota->left <= 0) {
                    return null;
                }

                if ($quota->max_pending != -1 && $quota->pending >= $quota->max_pending) {

                    $result = $this->cleanupUserPendingActions($user_id, $action);

                    if (! $result) {
                        return null;
                    }

                    $quota = Quota::where('user_id', $user_id)
                        ->where('action', $action)
                        ->lockForUpdate()
                        ->first();

                    if (! $quota || $quota->pending >= $quota->max_pending) {
                        return null;
                    }
                }

                $actionRecord = Action::create([
                    'user_id' => $user_id,
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

                $quota = Quota::where('user_id', $user_id)
                    ->where('action', $action)
                    ->lockForUpdate()
                    ->first();

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
     * Cleans up pending actions for a specific user and action that are older than 5 minutes.
     *
     * @return bool Returns true if the cleanup was successful, false otherwise.
     */
    public function cleanupUserPendingActions(int $user_id, string $action): bool
    {
        try {
            return DB::transaction(function () use ($user_id, $action) {

                $threshold = Carbon::now()->subMinutes(5);

                $actionRecords = Action::where('user_id', $user_id)
                    ->where('action', $action)
                    ->where('created_at', '<', $threshold)
                    ->get();

                if ($actionRecords->isEmpty()) {
                    return true;
                }

                $count = $actionRecords->count();

                Action::whereIn('id', $actionRecords->pluck('id'))->delete();

                $quota = Quota::where('user_id', $user_id)
                    ->where('action', $action)
                    ->lockForUpdate()
                    ->first();

                if ($quota) {
                    $newPending = max(0, $quota->pending - $count);
                    $newFailed = $quota->failed + $count;

                    $leftToIncrement = min($newFailed, $quota->max_failed) - $quota->failed;
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
                $quota = Quota::where('user_id', $user_id)
                    ->where('action', $action)
                    ->lockForUpdate()
                    ->first();

                if (! $quota) {
                    return false;
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
                        'failed' => 0,
                        'last_reset_at' => $now,
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
