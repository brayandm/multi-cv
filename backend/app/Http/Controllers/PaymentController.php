<?php

namespace App\Http\Controllers;

use App\Mail\UserPurchasedPlan;
use App\Models\User;
use App\Services\ActionService;
use App\Services\PaymentPlanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Stripe\Webhook;

class PaymentController extends Controller
{
    private function validateRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan' => 'required|string|in:freemium,occasional,daily_15',
        ]);

        return $validator;
    }

    private function createPlan($userId, $plan)
    {
        if ($plan === 'occasional') {
            PaymentPlanService::createOccasionalPlan($userId);
        } elseif ($plan === 'daily_15') {
            PaymentPlanService::createDaily15Plan($userId);
        }
    }

    public function createCheckoutSession(Request $request)
    {
        $validator = $this->validateRequest($request);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = $request->user();
        $plan = $request->plan;

        if ($plan === 'freemium') {
            return response()->json(['id' => 'freemium'], 200);
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        if (config('app.env') === 'production') {
            $priceIdMap = [
                'freemium' => '',
                'occasional' => 'price_1RAXuEBydkY3MlDEZkIKjGjO',
                'beta_testing' => 'price_1RJXTXBydkY3MlDEHkFijcg4',
                'daily_15' => 'price_1RAXrgBydkY3MlDEvKs2xvsZ',
            ];
        } else {
            $priceIdMap = [
                'freemium' => '',
                'occasional' => 'price_1RAhfpR9gIm0VrhqhhEMGey5',
                'beta_testing' => 'price_1RJX8PR9gIm0VrhqG2WiAAtF',
                'daily_15' => 'price_1RAhgTR9gIm0VrhqVc2DdjIY',
            ];
        }

        $actionService = app(ActionService::class);

        $quotaInfo = $actionService->getQuotaInfo($user->id, 'beta_testing');

        if ($quotaInfo && $quotaInfo['left'] > 0) {
            if ($plan == 'occasional') {
                $plan = 'beta_testing';
            }
        }

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => $priceIdMap[$plan],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => url(config('app.frontend_url') . '/payment/success?session_id={CHECKOUT_SESSION_ID}'),
            'cancel_url' => url(config('app.frontend_url') . '/payment/cancel'),
            'allow_promotion_codes' => true,
            'customer_email' => $user->email,
            'metadata' => [
                'user_id' => $user->id,
                'plan' => $plan,
            ],
            'customer_creation' => 'always',
        ]);

        return response()->json(['id' => $session->id]);
    }

    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook.secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (\UnexpectedValueException $e) {
            return response('Invalid payload', 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response('Invalid signature', 400);
        }

        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;

                $userId = $session->metadata->user_id ?? null;
                $plan = $session->metadata->plan ?? null;

                DB::transaction(function () use ($userId, $plan) {

                    if ($plan == 'beta_testing') {
                        $actionService = app(ActionService::class);

                        $actionService->consumeAction(
                            $userId,
                            'beta_testing'
                        );

                        PaymentPlanService::createOccasionalPlan($userId, 20);
                    } else {
                        $this->createPlan($userId, $plan);
                    }
                });

                $this->createPlan($userId, $plan);

                Log::info('✅ Payment successful', [
                    'email' => $session->customer_email ?? null,
                    'session_id' => $session->id,
                    'amount_total' => $session->amount_total,
                ]);

                $user = User::find($userId);

                if (config('app.env') == 'production') {
                    Mail::to(config('app.notification_mail'))->queue(new UserPurchasedPlan($user, $plan));
                }

                break;

            default:
                Log::info('📩 Stripe Event Received: ' . $event->type);
        }

        return response('Webhook received', 200);
    }
}
