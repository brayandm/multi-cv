<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InterCommunicationAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('X-API-Key');

        if ($token !== config('auth.inter_communication_token')) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        $request->attributes->set('is_internal_request', true);

        return $next($request);
    }
}
