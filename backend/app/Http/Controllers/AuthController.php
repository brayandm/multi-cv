<?php

namespace App\Http\Controllers;

use App\Helpers\CookiesHelper;
use App\Mail\UserSuspended;
use App\Models\User;
use App\Services\PaymentPlanService;
use App\Services\UserService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\StreamedResponse;

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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|max:255',
            'talent_pool' => 'required|boolean',
        ]);

        return $validator;
    }

    private function validateCorrectLoginUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8|max:255',
        ]);

        return $validator;
    }

    public function validateProfile($request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
        ]);

        return $validator;
    }

    public function validatePassword($request)
    {
        $validator = Validator::make($request->all(), [
            'old_password' => 'nullable|string|min:8|max:255',
            'password' => 'required|string|min:8|max:255',
        ]);

        return $validator;
    }

    public function validateLocale($request)
    {
        $validator = Validator::make($request->all(), [
            'locale' => 'required|string|max:255',
        ]);

        return $validator;
    }

    public function validateTalentPool($request)
    {
        $validator = Validator::make($request->all(), [
            'talent_pool' => 'required|boolean',
        ]);

        return $validator;
    }

    public function validateUserId($request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,id',
        ]);

        return $validator;
    }

    public function register(Request $request)
    {
        $validator = $this->validateCorrectRegisterUser($request);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        if (User::where('email', $request->email)->exists()) {
            return response()->json(['errors' => 'Email already exists'], 400);
        }

        $this->userService->createUser($request);

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

        return CookiesHelper::addAuthCookie(response()->json(['message' => 'Login successful']), $token);
    }

    public function getId(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'code' => 200,
            'user_id' => $user->id,
        ]);
    }

    public function updateLocale(Request $request)
    {
        $user = $request->user();

        $validator = $this->validateLocale($request);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user->update([
            'locale' => $request->locale,
        ]);

        return response()->json(['message' => 'Locale updated successfully']);
    }

    public function getLocale(Request $request)
    {
        $user = $request->user();

        return response()->json(['locale' => $user->locale]);
    }

    public function userStatus(Request $request)
    {
        $access_token = $request->bearerToken();

        if (! $access_token) {
            return response()->json(['authenticated' => false]);
        }

        $tokenHash = hash('sha256', explode('|', $access_token)[1]);

        $token = DB::table('personal_access_tokens')->where('token', $tokenHash)->first();

        if (! $token) {
            return response()->json(['authenticated' => false]);
        }

        if ($token->last_used_at) {
            if ((new Carbon($token->last_used_at))->diffInSeconds(Carbon::now(), false) > config('auth.max_age_session')) {
                return response()->json(['authenticated' => false]);
            }
        } else {
            if ((new Carbon($token->created_at))->diffInSeconds(Carbon::now(), false) > config('auth.max_age_session')) {
                return response()->json(['authenticated' => false]);
            }
        }

        if ((new Carbon($token->expires_at))->diffInSeconds(Carbon::now(), false) > 0) {
            return response()->json(['authenticated' => false]);
        }

        $user = $this->userService->findUserById($token->tokenable_id);

        $current_terms_version = config('app.privacy_policy_and_terms_of_service_version');

        $is_valid_terms_version = $user->accepted_terms_at ?
        Carbon::parse($user->accepted_terms_at)->gte(Carbon::parse($current_terms_version)) :
        null;

        $in_time = Carbon::now()->lt(Carbon::parse($current_terms_version)->addMonth());

        $notice_new_terms_version = $is_valid_terms_version ? null : ($user->accepted_terms_at ?
         ($in_time ? ($user->notified_terms_at ? null : true) : false) : null);

        $email_verified = $user->email_verified_at ? true : false;

        $is_first_login = $user->is_first_login;

        $is_in_talent_pool = $user->is_in_talent_pool;

        $payment_plan = PaymentPlanService::getPlan($user->id);

        $is_freemium = $payment_plan->name === 'freemium';

        return response()->json(['authenticated' => true,
            'is_valid_terms_version' => $is_valid_terms_version,
            'notice_new_terms_version' => $notice_new_terms_version,
            'email_verified' => $email_verified,
            'email' => $user->email,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'is_first_login' => $is_first_login,
            'is_in_talent_pool' => $is_in_talent_pool,
            'has_profile_picture' => $user->hasMedia('profile_picture'),
            'payment_plan' => $payment_plan->name,
            'is_freemium' => $is_freemium,
            'is_suspended' => $user->suspended_account_at ? true : false,
        ]);
    }

    public function finishFirstLogin(Request $request)
    {
        $user = $request->user();

        $user->update([
            'is_first_login' => false,
        ]);

        return response()->json(['message' => 'First login finished successfully']);
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

        $current_terms_version = config('app.privacy_policy_and_terms_of_service_version');

        $user->is_valid_terms_version = $user->accepted_terms_at ?
        Carbon::parse($user->accepted_terms_at)->gte(Carbon::parse($current_terms_version)) :
        null;

        $in_time = Carbon::now()->lt(Carbon::parse($current_terms_version)->addMonth());

        $user->notice_new_terms_version = $user->is_valid_terms_version ? null : ($user->accepted_terms_at ?
        ($in_time ? ($user->notified_terms_at ? null : true) : false) : null);

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

    public function updateTalentPool(Request $request)
    {
        $validator = $this->validateTalentPool($request);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user = $this->userService->findUserByEmail(auth()->user()->email);

        $user->update([
            'is_in_talent_pool' => (bool) $request->talent_pool,
        ]);

        return response()->json(['message' => 'Talent Pool updated successfully']);
    }

    public function updateAcceptedTermsVersion(Request $request)
    {
        $user = $this->userService->findUserByEmail(auth()->user()->email);

        $user->update([
            'accepted_terms_at' => Carbon::now(),
        ]);

        return response()->json(['message' => 'Accepted Privacy Policy and Terms of Service successfully']);
    }

    public function updateNotifiedTermsVersion(Request $request)
    {
        $user = $this->userService->findUserByEmail(auth()->user()->email);

        $user->update([
            'notified_terms_at' => Carbon::now(),
        ]);

        return response()->json(['message' => 'Notified Privacy Policy and Terms of Service successfully']);
    }

    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:10240', // 10MB
        ]);

        $user = User::find(auth()->user()->id);

        $user->clearMediaCollection('profile_picture');

        $extension = $request->file('photo')->getClientOriginalExtension();

        $user->addMediaFromRequest('photo')
            ->usingFileName("profile_picture.$extension")
            ->toMediaCollection('profile_picture');

        return response()->json([
            'message' => 'Profile picture updated successfully.',
        ]);
    }

    public function deleteProfilePicture()
    {
        $user = User::find(auth()->user()->id);

        $user->clearMediaCollection('profile_picture');

        return response()->json([
            'message' => 'Profile picture removed successfully.',
        ]);
    }

    public function getProfilePicture()
    {
        $user = User::find(auth()->user()->id);

        $media = $user->getFirstMedia('profile_picture');

        if (! $media) {
            return response()->json(['error' => 'No profile picture found.'], 404);
        }

        $lastModified = $media->updated_at;
        $etag = md5($media->id.$media->updated_at);

        $headers = [
            'Content-Type' => $media->mime_type,
            'Content-Disposition' => 'inline; filename="'.$media->file_name.'"',
            'Cache-Control' => 'public, max-age=0, must-revalidate',
            'Last-Modified' => $lastModified->format(DATE_RFC7231),
            'ETag' => $etag,
        ];

        $request = request();

        if (
            $request->getETags() && in_array($etag, $request->getETags()) ||
            strtotime($request->header('If-Modified-Since')) >= strtotime($lastModified)
        ) {
            return response('', 304, $headers);
        }

        return new StreamedResponse(function () use ($media) {
            $stream = $media->stream();
            fpassthru($stream);
            fclose($stream);
        }, 200, $headers);
    }

    public function updateTheme(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'theme' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user->update([
            'app_theme' => $request->theme,
        ]);

        return response()->json(['message' => 'Theme updated successfully']);
    }

    public function getTheme(Request $request)
    {
        $user = $request->user();

        return response()->json(['theme' => $user->app_theme]);
    }

    public function suspendAccount(Request $request)
    {
        $validator = $this->validateUserId($request);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user = User::find($request->user_id);

        if (! $user) {
            return response()->json(['errors' => 'User not found'], 404);
        }

        if ($user->suspended_account_at) {
            return response()->json(['errors' => 'User account is already suspended'], 400);
        }

        $user->update([
            'suspended_account_at' => Carbon::now(),
        ]);

        if (config('app.environment') == 'production') {
            Mail::to(config('app.notification_mail'))->queue(new UserSuspended($user));
        }
    }

    public function deleteAccount(Request $request)
    {
        sleep(2);
    }
}
