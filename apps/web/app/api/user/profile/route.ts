import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await auth();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { name: true, email: true, image: true },
    });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
}
