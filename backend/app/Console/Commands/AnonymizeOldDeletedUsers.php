<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class AnonymizeOldDeletedUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:anonymize-old-deleted';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Anonymize emails of users who were deleted more than 1 year ago';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $oneYearAgo = Carbon::now()->subYear();

        $users = User::onlyTrashed()
            ->where('deleted_at', '<', $oneYearAgo)
            ->get();

        foreach ($users as $user) {
            $user->email = 'deleted_'.Str::uuid().'@anon.local';
            $user->save();
            $this->info("Anonymized user ID {$user->id}");
        }

        $this->info('Anonymization complete.');

        return Command::SUCCESS;
    }
}
