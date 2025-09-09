<?php

namespace App\Jobs;

use App\Models\User;
use App\Helpers\TenantOwnerLogger;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Hash;
use Stancl\Tenancy\Contracts\Tenant;

class CreateTenantOwner implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Tenant $tenant;

    public function __construct(Tenant $tenant)
    {
        $this->tenant = $tenant;
    }

    public function handle()
    {
        // Switch to central database to load owner data
        $ownerData = tenancy()->central(function () {
            \Log::info('In central context', [
                'tenant_id' => $this->tenant->id,
                'database_connection' => \DB::connection()->getName(),
                'tenant_owners_count' => \App\Models\TenantOwner::count(),
                'all_tenant_owners' => \App\Models\TenantOwner::all()->toArray()
            ]);
            
            $freshTenant = $this->tenant->fresh();
            \Log::info('Fresh tenant data', [
                'tenant_data' => $freshTenant->toArray(),
                'owner_relationship' => $freshTenant->owner
            ]);
            
            return $freshTenant->owner;
        });
        
        if (!$ownerData) {
            TenantOwnerLogger::warning($this->tenant->id, "No owner data found");
            return;
        }

        // Log the start of owner creation
        TenantOwnerLogger::start($this->tenant->id, "Creating tenant owner: {$ownerData->name} ({$ownerData->email})");

        try {
            // Create the owner user in the TENANT database context
            $owner = $this->tenant->run(function () use ($ownerData) {
                return User::firstOrCreate(
                    [ 'email' => $ownerData->email ],
                    [
                        'name' => $ownerData->name,
                        'password' => $ownerData->password, // Already hashed
                        'email_verified_at' => now(),
                    ]
                );
            });



            // Log successful owner creation
            TenantOwnerLogger::success($this->tenant->id, $owner->id, $owner->email);

        } catch (\Exception $e) {
            TenantOwnerLogger::failure($this->tenant->id, $e->getMessage(), [
                'owner_email' => $ownerData->email ?? 'unknown'
            ]);
            
            // Re-throw the exception so the job fails
            throw $e;
        }
    }
}
