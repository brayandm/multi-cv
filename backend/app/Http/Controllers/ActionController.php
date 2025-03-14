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
        return response()->json([
            'code' => 200,
        ]);
    }

    public function rollback()
    {
        return response()->json([
            'code' => 200,
        ]);
    }
}
