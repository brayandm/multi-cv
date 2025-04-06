<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class PaymentController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => 'price_1RAhgTR9gIm0VrhqVc2DdjIY',
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => url('/success?session_id={CHECKOUT_SESSION_ID}'),
            'cancel_url' => url('/cancel'),
        ]);

        return response()->json(['id' => $session->id]);
    }
}
