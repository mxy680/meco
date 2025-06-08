import { User } from "@prisma/client";

export async function getUserProfile(): Promise<User | null> {
    try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Failed to fetch user profile");
        return await res.json() as User;
    } catch (err) {
        console.error("getUserProfile error:", err);
        return null;
    }
}
