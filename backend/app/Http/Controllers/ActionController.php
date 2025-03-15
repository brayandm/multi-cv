<?php

namespace App\Http\Controllers;

use App\Services\ActionService;

class ActionController extends Controller
{
    private ActionService $actionService;

    public function __construct(ActionService $actionService)
    {
        $this->actionService = $actionService;
    }

    public function consumeAction()
    {
        $user = auth()->user();

        if($user->email === 'admin@multicv.space') {
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

        if($user->email === 'admin@multicv.space') {
            return response()->json([
                'code' => 200,
            ]);
        }

        return response()->json([
            'code' => 403,
        ]);
    }
}
