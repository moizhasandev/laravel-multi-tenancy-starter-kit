import { Button } from "@/components/ui/button";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { type Tenant } from "@/types";
import { Plus } from "lucide-react";
import DeleteTenant from "@/components/delete-tenant";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tenants',
        href: '/tenants',
    },
];

interface Props {
    tenants: Tenant[];
}

export default function Tenant({ tenants }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tenants" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Tenants</h1>
                    <Link href={route('tenants.create')}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Tenant
                        </Button>
                    </Link>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {tenants.length > 0 ? (
                        tenants.map((tenant) => (
                            <div key={tenant.id} className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-semibold">Tenant {tenant.id}</h3>
                                    <DeleteTenant tenant={tenant} />
                                </div>
                                <p className="text-sm text-muted-foreground">Created: {new Date(tenant.created_at).toLocaleDateString()}</p>
                                
                                {tenant.owner && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium">Owner:</p>
                                        <p className="text-sm">
                                            {tenant.owner.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {tenant.owner.email}
                                        </p>
                                    </div>
                                )}
                                
                                {tenant.domains && tenant.domains.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium">Domains:</p>
                                        {tenant.domains.map((domain) => (
                                            <p key={domain.id} className="text-sm text-blue-600 dark:text-blue-400">
                                                {domain.domain}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}