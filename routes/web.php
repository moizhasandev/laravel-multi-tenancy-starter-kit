<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TenantController;

Route::get('/', function () {
    $tenants = DB::table('tenants')->get();
    return Inertia::render('welcome', compact('tenants'));
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('tenants', [TenantController::class, 'index'])->name('tenants');
    Route::get('tenants/create', [TenantController::class, 'create'])->name('tenants.create');
    Route::post('tenants', [TenantController::class, 'store'])->name('tenants.store');
    Route::delete('tenants/{tenant}', [TenantController::class, 'destroy'])->name('tenants.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
