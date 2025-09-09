<?php

namespace Database\Seeders\Tenant;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $roles = [
            'Owner',
            'Manager', 
            'Team Lead',
            'Agent',
            'Quality Assurance',
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        \Log::info('Tenant roles seeded', [
            'tenant_id' => tenant('id'),
            'roles_created' => count($roles)
        ]);
    }
}
