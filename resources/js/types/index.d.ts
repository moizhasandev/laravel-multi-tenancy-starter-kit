import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface Tenancy {
    initialized: boolean;
    tenant: Tenant | null;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    tenancy: Tenancy;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Domain {
    id: number;
    domain: string;
    tenant_id: string;
    created_at: string;
    updated_at: string;
}

export interface TenantOwner {
    name: string;
    email: string;
    created_at: string;
}

export interface Tenant {
    id: string;
    data: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    domains?: Domain[];
    owner?: TenantOwner;
    [key: string]: unknown;
}
