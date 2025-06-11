import { User } from "@prisma/client";

/**
 * Fetch all users (or profiles).
 */
export async function getUsers(): Promise<User[]> {
    const res = await fetch(`/api/user/profile`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
}

/**
 * Fetch the current user from the session.
 */
export async function getCurrentUser(): Promise<User> {
    const res = await fetch(`/api/user/profile`);
    if (!res.ok) throw new Error('Failed to fetch current user');
    return res.json();
}

/**
 * Fetch a user by id.
 */
export async function getUserById(userId: string): Promise<User> {
    const res = await fetch(`/api/user/profile?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Failed to fetch user by id');
    return res.json();
}

/**
 * Update a user by id. Accepts any updatable fields.
 */
export async function updateUser(id: string, data: Partial<User>): Promise<User> {
    const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
}

/**
 * Delete a user by id.
 */
export async function deleteUser(id: string): Promise<User> {
    const res = await fetch('/api/user/profile', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
}
