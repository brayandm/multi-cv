<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class PaymentController extends Controller
{
    private function validateRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan' => 'required|string|in:free,occasional,daily_15',
        ]);

        return $validator;
    }

    public function createCheckoutSession(Request $request)
    {
        $validator = $this->validateRequest($request);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        if ($request->plan === 'free') {
            return response()->json(['id' => 'free'], 200);
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        $priceIdMap = [
            'free' => '',
            'occasional' => 'price_1RAhfpR9gIm0VrhqhhEMGey5',
            'daily_15' => 'price_1RAhgTR9gIm0VrhqVc2DdjIY',
        ];

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => $priceIdMap[$request->plan],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => url('/success?session_id={CHECKOUT_SESSION_ID}'),
            'cancel_url' => url('/cancel'),
        ]);

        return response()->json(['id' => $session->id]);
    }
}
