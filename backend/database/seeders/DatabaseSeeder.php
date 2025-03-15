<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Quota;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User factory
        $emails = [
            'admin@multicv.space',
            'hello.multicv@gmail.com',
        ];

        foreach ($emails as $email) {
            $this->command->info('Creating user '.$email);
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => 'User',
                    'email_verified_at' => now(),
                ]
            );

            Quota::create([
                'user_id' => $user->id,
                'action' => 'generate_cv',
                'left' => 10,
                'quota' => 10,
                'pending' => 0,
                'max_pending' => -1,
                'failed' => 0,
                'max_failed' => 10,
                'frequency' => 'daily',
                'cumulative' => false,
                'last_reset_at' => now(),
            ]);

            Quota::create([
                'user_id' => $user->id,
                'action' => 'generate_cv_inline',
                'left' => 100,
                'quota' => 100,
                'pending' => 0,
                'max_pending' => -1,
                'failed' => 0,
                'max_failed' => 10,
                'frequency' => 'daily',
                'cumulative' => false,
                'last_reset_at' => now(),
            ]);
        }

    }
}
