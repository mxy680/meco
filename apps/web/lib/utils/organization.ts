import { Organization } from "@prisma/client";

/**
 * Fetch all organizations for a user by userId.
 */
export async function getOrganizations(userId: string): Promise<Organization[]> {
    const res = await fetch(`/api/user/organization?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Failed to fetch organizations');
    return res.json();
}

/**
 * Fetch the current user's active organization.
 */
export async function getActiveOrganization(): Promise<Organization> {
    const res = await fetch('/api/user/organization');
    if (!res.ok) throw new Error('Failed to fetch active organization');
    return res.json();
}

/**
 * Fetch a single organization by id. (You may need to implement this route if not present.)
 */
export async function getOrganization(id: string): Promise<Organization> {
    const res = await fetch(`/api/user/organization?id=${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to fetch organization');
    return res.json();
}

/**
 * Create a new organization.
 */
export async function createOrganization(data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Promise<Organization> {
    const res = await fetch('/api/user/organization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create organization');
    return res.json();
}

/**
 * Update an organization by id. Accepts any updatable fields.
 */
export async function updateOrganization(id: string, data: Partial<Organization>): Promise<Organization> {
    const res = await fetch('/api/user/organization', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) throw new Error('Failed to update organization');
    return res.json();
}

/**
 * Delete an organization by id.
 */
export async function deleteOrganization(id: string): Promise<Organization> {
    const res = await fetch('/api/user/organization', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Failed to delete organization');
    return res.json();
}