<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Customize auth redirect based on tenancy context
        \Illuminate\Auth\Middleware\Authenticate::redirectUsing(function ($request) {
            return tenancy()->initialized 
                ? route('tenant.login') 
                : route('login');
        });
    }
}
