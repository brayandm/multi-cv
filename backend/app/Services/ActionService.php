<?php

namespace App\Services;

use App\Models\Quota;
use Illuminate\Support\Facades\DB;

class ActionService
{
    /**
     * Consumes an action from the user's quota.
     *
     * @return bool Indicates whether the operation was successful.
     */
    public function consumeAction(int $user_id, string $action): bool
    {
        return DB::transaction(function () use ($user_id, $action) {
            $quota = Quota::where('user_id', $user_id)
                ->where('action', $action)
                ->lockForUpdate()
                ->first();

            if (! $quota || $quota->left <= 0) {
                return false;
            }

            $quota->decrement('left');
            $quota->update(['last_used_at' => now()]);

            return true;
        });
    }

    /**
     * Rolls back the consumption of an action from the user's quota.
     *
     * @return bool Indicates whether the rollback was successful.
     */
    public function rollbackAction(int $user_id, string $action): bool
    {
        return DB::transaction(function () use ($user_id, $action) {
            $quota = Quota::where('user_id', $user_id)
                ->where('action', $action)
                ->lockForUpdate()
                ->first();

            if (! $quota || $quota->left >= $quota->quota) {
                return false;
            }

            $quota->increment('left');
            $quota->increment('failed');

            return true;
        });
    }
}
