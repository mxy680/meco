import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/active-organization { email: string }
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!session || !email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        activeOrganization: true,
      },
    });

    if (!user || !user.activeOrganization) {
      return NextResponse.json({ error: "Active organization not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.activeOrganization.id,
      name: user.activeOrganization.name,
    });
  } catch (error) {
    console.error("Error fetching active organization:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

