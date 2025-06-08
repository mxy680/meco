import { Organization } from "@prisma/client";

export async function getOrganization(): Promise<Organization | null> {
    try {
        const res = await fetch("/api/user/organization");
        if (!res.ok) throw new Error("Failed to fetch organization");
        return await res.json() as Organization;
    } catch (err) {
        console.error("getOrganization error:", err);
        return null;
    }
}
