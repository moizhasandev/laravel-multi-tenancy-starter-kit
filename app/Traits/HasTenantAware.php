<?php

namespace App\Traits;

trait HasTenantAware
{
    /**
     * Determine the appropriate login page based on tenancy context.
     *
     * @return string
     */
    protected function determineLoginPage(): string
    {
        return tenancy()->initialized 
            ? 'tenant/auth/login' 
            : 'auth/login';
    }

    /**
     * Determine the appropriate register page based on tenancy context.
     *
     * @return string
     */
    protected function determineRegisterPage(): string
    {
        return tenancy()->initialized 
            ? 'tenant/auth/register' 
            : 'auth/register';
    }

    /**
     * Check if we're in a tenant context.
     *
     * @return bool
     */
    protected function isTenantContext(): bool
    {
        return tenancy()->initialized;
    }

    /**
     * Get the current tenant ID if in tenant context.
     *
     * @return string|null
     */
    protected function getCurrentTenantId(): ?string
    {
        return tenancy()->initialized ? tenant('id') : null;
    }
}
