import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { ArrowLeft, Plus } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tenants',
        href: '/tenants',
    },
    {
        title: 'Create Tenant',
        href: '/tenants/create',
    },
];

export default function CreateTenant() {
    const { data, setData, post, processing, errors } = useForm({
        id: '',
        domain: '',
        data: {},
        owner_name: '',
        owner_email: '',
        owner_password: '',
        owner_password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tenants.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Tenant" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>

                <div className="mx-auto w-full max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Create New Tenant
                            </CardTitle>
                            <CardDescription>
                                Add a new tenant to your application. Each tenant will have their own isolated environment.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="id">Tenant ID</Label>
                                    <Input
                                        id="id"
                                        type="text"
                                        value={data.id}
                                        onChange={(e) => setData('id', e.target.value)}
                                        placeholder="Enter tenant ID (e.g., acme-corp)"
                                        className={errors.id ? 'border-red-500' : ''}
                                        autoComplete="off"
                                    />
                                    {errors.id && (
                                        <p className="text-sm text-red-500">{errors.id}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        This will be the unique identifier for the tenant. Use lowercase letters, numbers, and hyphens only.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="domain">Domain</Label>
                                    <Input
                                        id="domain"
                                        type="text"
                                        value={data.domain}
                                        onChange={(e) => setData('domain', e.target.value)}
                                        placeholder="Enter domain (e.g., acme-corp)"
                                        className={errors.domain ? 'border-red-500' : ''}
                                        autoComplete="off"
                                    />
                                    {errors.domain && (
                                        <p className="text-sm text-red-500">{errors.domain}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        Enter the subdomain for this tenant (e.g., "acme-corp" will become "acme-corp.yourdomain.com"). The full domain will be automatically generated.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="data">Additional Data (Optional)</Label>
                                    <textarea
                                        id="data"
                                        value={JSON.stringify(data.data, null, 2)}
                                        onChange={(e) => {
                                            try {
                                                const parsed = JSON.parse(e.target.value);
                                                setData('data', parsed);
                                            } catch {
                                                // If JSON is invalid, don't update
                                            }
                                        }}
                                        placeholder='{"name": "Acme Corp", "plan": "premium"}'
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                        rows={4}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Additional metadata for the tenant in JSON format.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="owner_name">Owner Name</Label>
                                    <Input
                                        id="owner_name"
                                        type="text"
                                        value={data.owner_name}
                                        onChange={(e) => setData('owner_name', e.target.value)}
                                        placeholder="Enter owner's full name"
                                        className={errors.owner_name ? 'border-red-500' : ''}
                                        autoComplete="name"
                                    />
                                    {errors.owner_name && (
                                        <p className="text-sm text-red-500">{errors.owner_name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="owner_email">Owner Email</Label>
                                    <Input
                                        id="owner_email"
                                        type="email"
                                        value={data.owner_email}
                                        onChange={(e) => setData('owner_email', e.target.value)}
                                        placeholder="Enter owner's email address"
                                        className={errors.owner_email ? 'border-red-500' : ''}
                                        autoComplete="email"
                                    />
                                    {errors.owner_email && (
                                        <p className="text-sm text-red-500">{errors.owner_email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="owner_password">Owner Password</Label>
                                    <Input
                                        id="owner_password"
                                        type="password"
                                        value={data.owner_password}
                                        onChange={(e) => setData('owner_password', e.target.value)}
                                        placeholder="Enter a secure password"
                                        className={errors.owner_password ? 'border-red-500' : ''}
                                        autoComplete="new-password"
                                    />
                                    {errors.owner_password && (
                                        <p className="text-sm text-red-500">{errors.owner_password}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="owner_password_confirmation">Confirm Password</Label>
                                    <Input
                                        id="owner_password_confirmation"
                                        type="password"
                                        value={data.owner_password_confirmation}
                                        onChange={(e) => setData('owner_password_confirmation', e.target.value)}
                                        placeholder="Confirm the password"
                                        className={errors.owner_password_confirmation ? 'border-red-500' : ''}
                                        autoComplete="new-password"
                                    />
                                    {errors.owner_password_confirmation && (
                                        <p className="text-sm text-red-500">{errors.owner_password_confirmation}</p>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        {processing ? 'Creating...' : 'Create Tenant'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 