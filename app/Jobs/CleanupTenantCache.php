<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Stancl\Tenancy\Contracts\Tenant;

class CleanupTenantCache implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Tenant $tenant;

    public function __construct(Tenant $tenant)
    {
        $this->tenant = $tenant;
    }

    public function handle()
    {
        // Clear session cache if any
        if (session()->has('tenant_' . $this->tenant->id)) {
            session()->forget('tenant_' . $this->tenant->id);
        }

        // Note: Stancl/Tenancy automatically handles cache cleanup when tenant is deleted
        // This job is mainly for any additional cleanup you might need
    }
} 