<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    private function validateCorrectRegisterUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'string|min:8|max:255|nullable',
            'auth_token' => 'string|max:255|nullable',
        ]);

        return $validator;
    }

    private function validateCorrectLoginUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'string|email|max:255|nullable',
            'user_id' => 'integer|nullable',
            'password' => 'string|min:8|max:255|nullable',
            'auth_token' => 'string|max:255|nullable',
        ]);

        return $validator;
    }

    public function validateProfile($request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
        ]);

        return $validator;
    }

    public function validatePassword($request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string|min:8|max:255',
        ]);

        return $validator;
    }

    public function validateUserDataWithToken($request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'auth_token' => 'required|string|max:255',
        ]);

        return $validator;
    }

    public function getUserDataWithToken(Request $request)
    {
        $validator = $this->validateUserDataWithToken($request);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user = $this->userService->findUserById($request->user_id);

        if ($request->auth_token !== $user->auth_token) {
            return response()->json(['errors' => 'Token is incorrect'], 400);
        }

        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }

    public function register(Request $request)
    {
        $validator = $this->validateCorrectRegisterUser($request);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        if (is_null($request->password) && is_null($request->auth_token)) {
            return response()->json(['errors' => 'Password or token is required'], 400);
        }

        if (is_null($request->password) && ! is_null($request->auth_token)) {
            $user = User::where('email', $request->email)->first();

            if ($request->auth_token !== $user->auth_token) {
                return response()->json(['errors' => 'Token is incorrect'], 400);
            }

            $user->update([
                'privacy_policy_accept' => true,
            ]);

            return response()->json(['message' => 'User created successfully']);
        }

        if (User::where('email', $request->email)->exists()) {
            return response()->json(['errors' => 'Email already exists'], 400);
        }

        $user = $this->userService->createUser($request);

        return response()->json(['message' => 'User created successfully']);
    }

    public function login(Request $request)
    {
        $validator = $this->validateCorrectLoginUser($request);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        if (! $this->userService->isCredentialsCorrect($request)) {
            return response()->json(['errors' => 'Bad credentials'], 401);
        }

        if (! is_null($request->email)) {
            $user = $this->userService->findUserByEmail($request->email);
        } elseif (! is_null($request->user_id)) {
            $user = $this->userService->findUserById($request->user_id);
        } else {
            return response()->json(['errors' => 'Bad credentials'], 401);
        }

        $token = $this->userService->createUserToken($user);

        return response()->json(['access_token' => $token->plainTextToken, 'token_type' => 'bearer', 'expires_in' => $token->accessToken->expires_at]);
    }

    public function verify()
    {
        return response()->json(['message' => 'Successful verification']);
    }

    public function logout(Request $request)
    {
        $user = $this->userService->findUserByEmail(auth()->user()->email);

        $tokenId = explode('|', $request->bearerToken())[0];

        $this->userService->deleteUserTokenById($user, $tokenId);

        return response()->json(['message' => 'Successful logout']);
    }

    public function logoutall()
    {
        $user = $this->userService->findUserByEmail(auth()->user()->email);

        $this->userService->deleteAllUserTokens($user);

        return response()->json(['message' => 'Successful logout']);
    }

    public function getUser(Request $request)
    {
        $user = $request->user();
        $user->is_password_null = is_null($user->password);

        return $user;
    }

    public function updateProfile(Request $request)
    {
        $validator = $this->validateProfile($request);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user = $this->userService->findUserByEmail(auth()->user()->email);

        $this->userService->updateProfile($user, $request);

        return response()->json(['message' => 'User updated successfully']);
    }

    public function updatePassword(Request $request)
    {
        $validator = $this->validatePassword($request);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user = $this->userService->findUserByEmail(auth()->user()->email);

        if (! is_null($user->password)) {
            if (! Hash::check($request->old_password, $user->password)) {
                return response()->json(['errors' => 'Old password is incorrect'], 401);
            }
        }

        $this->userService->updatePassword($user, $request);

        return response()->json(['message' => 'Password updated successfully']);
    }
}
