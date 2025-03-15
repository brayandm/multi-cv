<?php

namespace App\Http\Controllers;

use App\Services\ActionService;

class ActionController extends Controller
{
    private ActionService $actionService;

    private $allowed_emails = [
        'admin@multicv.space',
        'hello.multicv@gmail.com',
    ];

    public function __construct(ActionService $actionService)
    {
        $this->actionService = $actionService;
    }

    public function consumeAction()
    {
        $user = auth()->user();

        if (in_array($user->email, $this->allowed_emails)) {
            return response()->json([
                'code' => 200,
            ]);
        }

        return response()->json([
            'code' => 403,
        ]);
    }

    public function rollbackAction()
    {
        $user = auth()->user();

        if (in_array($user->email, $this->allowed_emails)) {
            return response()->json([
                'code' => 200,
            ]);
        }

        return response()->json([
            'code' => 403,
        ]);
    }
}
