<?php

namespace App\Http\Controllers;

use App\Services\ActionService;
use Illuminate\Support\Facades\Validator;

class ActionController extends Controller
{
    private ActionService $actionService;

    public function __construct(ActionService $actionService)
    {
        $this->actionService = $actionService;
    }

    public function validateAction($request)
    {
        $validator = Validator::make($request->all(), [
            'action' => 'required|string',
        ]);

        return $validator;
    }

    public function consumeAction($request)
    {
        $validator = $this->validateAction($request);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $user = auth()->user();

        if(!$user->id) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $this->actionService->consumeAction($user->id, 'generate_cv');
    }

    public function rollbackAction($request)
    {
        $validator = $this->validateAction($request);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $user = auth()->user();

        if(!$user->id) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $this->actionService->rollbackAction($user->id, 'generate_cv');
    }
}
