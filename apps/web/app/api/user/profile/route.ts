import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

/**
 * GET /api/user/profile
 * Get the current user profile from session. Returns id, name, email, image.
 */
export async function GET(req: Request) {
    // Optionally accept ?userId=... as a query parameter
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (userId) {
        // Fetch user by ID
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, image: true },
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user);
    }

    // Otherwise, fetch current user from session
    const session = await auth();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, name: true, email: true, image: true },
    });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
}

/**
 * PUT /api/user/profile
 * Update the current user (from session). Expects JSON body with any updatable fields (name, image).
 * Returns the updated user object (id, name, email, image).
 */
export async function PUT(req: Request) {
    // Optionally accept userId in the request body
    const session = await auth();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const { userId, ...rest } = body;
        // Accept any field from the User model except id/email (email is used for lookup)
        // This ensures the API is future-proof if you add more fields to the User model
        const dataToUpdate: Partial<Omit<User, 'id' | 'email'>> = { ...rest };
        const updateObj = dataToUpdate as Record<string, unknown>;
        delete updateObj.email;
        delete updateObj.id;
        // If userId is provided, update by id, else by session email
        const where = userId ? { id: userId } : { email: session.user.email };
        const updatedUser = await prisma.user.update({
            where,
            data: updateObj,
            select: { id: true, name: true, email: true, image: true },
        });
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

/**
 * DELETE /api/user/profile
 * Delete the current user (from session). Returns the deleted user object.
 */
export async function DELETE(req: Request) {
    // Optionally accept userId in the request body
    const session = await auth();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        let userId: string | undefined = undefined;
        if (req.method === "DELETE") {
            try {
                const body = await req.json();
                userId = body.userId;
            } catch { }
        }
        // If userId is provided, delete by id, else by session email
        const where = userId ? { id: userId } : { email: session.user.email };
        const deletedUser = await prisma.user.delete({
            where,
            select: { id: true, name: true, email: true, image: true },
        });
        return NextResponse.json(deletedUser);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
