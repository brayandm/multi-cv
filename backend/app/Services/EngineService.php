<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class EngineService
{
    protected string $baseUrl;

    protected string $token;

    public function __construct()
    {
        $this->baseUrl = config('services.engine.url');
        $this->token = config('auth.inter_communication_token');
    }

    public function deleteAccount(string $userId): bool
    {
        $response = Http::withHeaders([
            'X-API-Token' => $this->token,
        ])->post("{$this->baseUrl}/profile/delete", [
            'user_id' => $userId,
        ]);

        return $response->successful();
    }
}
