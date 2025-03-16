<?php

namespace App\Http\Controllers;

use App\Services\ActionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

    public function validateActionId(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'action_id' => 'required|string',
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

        $action = $validator->validated()['action'];

        $result = $this->actionService->consumeAction($user->id, $action);

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
        $validator = $this->validateActionId($request);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $action_id = $validator->validated()['action_id'];

        $result = $this->actionService->rollbackAction($action_id);

        if (! $result) {
            return response()->json([
                'code' => 500,
            ]);
        }

        return response()->json([
            'code' => 200,
        ]);
    }
}
