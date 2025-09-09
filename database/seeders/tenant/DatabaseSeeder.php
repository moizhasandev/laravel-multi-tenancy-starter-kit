<?php

namespace Database\Seeders\Tenant;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call tenant-specific seeders
        $this->call([
            RoleSeeder::class,
            // Add other tenant seeders here as needed
        ]);

        // Log that tenant seeding is complete
        \Log::info('Tenant database seeded successfully', [
            'tenant_id' => tenant('id'),
            'seeded_at' => now()->toISOString()
        ]);
    }
}
