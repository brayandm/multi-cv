<?php

namespace App\Http\Controllers;

use App\Services\PaymentPlanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

        if ($request->plan === 'freemium') {
            return response()->json(['id' => 'freemium'], 200);
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        if (config('app.env') === 'production') {
            $priceIdMap = [
                'freemium' => '',
                'occasional' => 'price_1RAXuEBydkY3MlDEZkIKjGjO',
                'daily_15' => 'price_1RAXrgBydkY3MlDEvKs2xvsZ',
            ];
        } else {
            $priceIdMap = [
                'freemium' => '',
                'occasional' => 'price_1RAhfpR9gIm0VrhqhhEMGey5',
                'daily_15' => 'price_1RAhgTR9gIm0VrhqVc2DdjIY',
            ];
        }

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => $priceIdMap[$request->plan],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => url(config('app.frontend_url').'/payment/success?session_id={CHECKOUT_SESSION_ID}'),
            'cancel_url' => url(config('app.frontend_url').'/payment/cancel'),
            'metadata' => [
                'user_id' => $request->user()->id,
                'plan' => $request->plan,
            ],
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

                $this->createPlan($userId, $plan);

                Log::info('✅ Payment successful', [
                    'email' => $session->customer_email ?? null,
                    'session_id' => $session->id,
                    'amount_total' => $session->amount_total,
                ]);

                break;

            default:
                Log::info('📩 Stripe Event Received: '.$event->type);
        }

        return response('Webhook received', 200);
    }
}
