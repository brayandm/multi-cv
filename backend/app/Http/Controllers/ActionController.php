<?php

namespace App\Http\Controllers;

use App\Services\ActionService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ActionController extends Controller
{
    private ActionService $actionService;

    public function __construct(ActionService $actionService)
    {
        $this->actionService = $actionService;
    }

    public function validateAction(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'action' => 'required|string',
        ]);

        return $validator;
    }

    public function consumeAction(Request $request)
    {
        $validator = $this->validateAction($request);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $user = auth()->user();

        if (! $user->id) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $result = $this->actionService->consumeAction($user->id, 'generate_cv');

        if (! $result) {
            return response()->json([
                'code' => 403,
            ]);
        }

        return response()->json([
            'code' => 200,
            'user_id' => $user->id,
        ]);
    }

    public function rollbackAction(Request $request)
    {
        $validator = $this->validateAction($request);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $user = auth()->user();

        if (! $user->id) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $result = $this->actionService->rollbackAction($user->id, 'generate_cv');

        if (! $result) {
            return response()->json([
                'code' => 403,
            ]);
        }

        return response()->json([
            'code' => 200,
            'user_id' => $user->id,
        ]);
    }
}
