<?php

namespace App\Http\Middleware;

use Closure;

class CustomSanctumMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        if ($request->hasCookie(config("auth.cookie_name"))) {
            $token = $request->cookie(config("auth.cookie_name"));

            $request->headers->set('Authorization', 'Bearer '.$token);
        }

        return $next($request);
    }
}
