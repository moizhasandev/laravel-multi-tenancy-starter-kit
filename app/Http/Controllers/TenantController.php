<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\TenantOwner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Stancl\Tenancy\Database\Models\Domain;

class TenantController extends Controller
{
    /**
     * Display the tenants page.
     */
    public function index()
    {
        $tenants = Tenant::with(['domains', 'owner'])->get();
        
        return Inertia::render('tenants/index', [
            'tenants' => $tenants
        ]);
    }

    /**
     * Show the form for creating a new tenant.
     */
    public function create()
    {
        return Inertia::render('tenants/create');
    }

    /**
     * Store a newly created tenant in storage.
     */
    public function store(Request $request)
    {
        $fullDomain = implode('.', array_filter([$request->domain, env('CENTRAL_DOMAIN', 'localhost')]));
        
        $request->validate([
            'id' => 'required|string|unique:tenants,id',
            'domain' => 'required|string|unique:domains,domain,' . $fullDomain,
            'owner_name' => 'required|string|max:255',
            'owner_email' => 'required|email|max:255',
            'owner_password' => 'required|string|min:8|confirmed',
            'owner_password_confirmation' => 'required|string',
        ]);

        // 1) Create owner first in central DB
        $owner = TenantOwner::create([
            'tenant_id' => $request->id,
            'name' => $request->owner_name,
            'email' => $request->owner_email,
            'password' => Hash::make($request->owner_password),
        ]);

        // 2) Create tenant (this triggers the tenancy pipeline)
        $tenant = Tenant::create([
            'id' => $request->id,
        ]);
        
        // Debug: Confirm owner exists before pipeline jobs run
        \Log::info('Tenant owner pre-created (before pipeline)', [
            'tenant_id' => $request->id,
            'owner_id' => $owner->id,
            'owner_email' => $owner->email,
        ]);
        
        // Double check: Query the table directly
        $checkOwner = \App\Models\TenantOwner::where('tenant_id', $tenant->id)->first();
        \Log::info('Direct query check', [
            'found_owner' => $checkOwner ? $checkOwner->toArray() : null
        ]);
        
        $tenant->domains()->create(['domain' => $fullDomain]);

        return redirect()->route('tenants')->with('success', 'Tenant and domain created successfully.');
    }

    /**
     * Remove the specified tenant from storage.
     */
    public function destroy(Tenant $tenant)
    {
        // Delete the tenant (this will trigger TenantDeleted event and delete the database)
        $tenant->delete();

        return redirect()->route('tenants')->with('success', 'Tenant, database, and cache deleted successfully.');
    }
} 