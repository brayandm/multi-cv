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
                'action' => 'render_cv',
                'quota' => 10,
                'left' => 10,
                'max_left' => 50,
                'max_failed' => 10,
                'max_pending' => 3,
                'frequency' => 'minutes',
                'cumulative' => true,
            ]);

            Quota::create([
                'user_id' => $user->id,
                'action' => 'render_cv_inline',
                'quota' => 100,
                'left' => 100,
                'max_failed' => 10,
                'max_pending' => 3,
                'frequency' => 'minutes',
                'cumulative' => false,
            ]);

            Quota::create([
                'user_id' => $user->id,
                'action' => 'generate_cv_inline',
                'quota' => 10,
                'left' => 10,
                'max_failed' => 10,
                'max_pending' => 3,
                'frequency' => 'minutes',
                'cumulative' => false,
            ]);
        }

    }
}
