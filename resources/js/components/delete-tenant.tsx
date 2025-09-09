import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { router } from "@inertiajs/react";

interface DeleteTenantProps {
    tenant: {
        id: string;
        domains?: Array<{ domain: string }>;
    };
}

export default function DeleteTenant({ tenant }: DeleteTenantProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route('tenants.destroy', tenant.id), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <>
            <Button
                variant="destructive"
                size="sm"
                onClick={() => setOpen(true)}
                className="gap-2"
            >
                <Trash2 className="h-4 w-4" />
                Delete
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-destructive" />
                            Delete Tenant
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete tenant <strong>{tenant.id}</strong>? 
                            This will permanently delete:
                        </DialogDescription>
                    </DialogHeader>

                    <div className="rounded-md bg-destructive/10 p-3 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-destructive rounded-full"></div>
                            <span className="text-sm font-medium text-destructive">The tenant record and all its data</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-destructive rounded-full"></div>
                            <span className="text-sm font-medium text-destructive">The tenant's entire database</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-destructive rounded-full"></div>
                            <span className="text-sm font-medium text-destructive">All tenant-specific cache and sessions</span>
                        </div>
                        {tenant.domains && tenant.domains.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                                <span className="text-sm font-medium text-destructive">Associated domains:</span>
                            </div>
                        )}
                        {tenant.domains && tenant.domains.length > 0 && (
                            <ul className="ml-4 text-sm text-destructive/80">
                                {tenant.domains.map((domain) => (
                                    <li key={domain.domain} className="list-disc">
                                        {domain.domain}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete Tenant
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
} 