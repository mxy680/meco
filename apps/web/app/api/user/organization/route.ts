import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/user/organization
 * Get the current user's active organization (from session).
 * Returns id, name, ownerId, createdAt, updatedAt.
 */
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

    const org = user.activeOrganization;
    return NextResponse.json({
      id: org.id,
      name: org.name,
      ownerId: org.ownerId,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching active organization:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * POST /api/user/organization
 * Create a new organization. Expects JSON body with name (required).
 * Returns the created organization (id, name, ownerId, createdAt, updatedAt).
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!session || !email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const body = await req.json();
    const { name } = body;
    if (!name) {
      return NextResponse.json({ error: "Missing organization name" }, { status: 400 });
    }
    const org = await prisma.organization.create({
      data: {
        name,
        ownerId: user.id,
      },
      select: { id: true, name: true, ownerId: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json(org, { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * PUT /api/user/organization
 * Update an organization by id. Expects JSON body with id and any updatable fields (name, ownerId).
 * Returns the updated organization.
 */
export async function PUT(req: Request) {
  // Optionally accept orgId in the request body
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { orgId, id, ...rest } = body;
    const orgIdToUse = orgId || id;
    if (!orgIdToUse) {
      return NextResponse.json({ error: "Missing organization id" }, { status: 400 });
    }
    // Remove id/orgId from update fields if present
    const dataToUpdate = { ...rest };
    delete dataToUpdate.id;
    delete dataToUpdate.orgId;
    const org = await prisma.organization.update({
      where: { id: orgIdToUse },
      data: dataToUpdate,
      select: { id: true, name: true, ownerId: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json(org);
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/user/organization
 * Delete an organization by id. Expects JSON body with id.
 * Returns the deleted organization.
 */
export async function DELETE(req: Request) {
  // Optionally accept orgId in the request body
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let orgId: string | undefined = undefined;
    try {
      const body = await req.json();
      orgId = body.orgId || body.id;
    } catch {}
    if (!orgId) {
      return NextResponse.json({ error: "Missing organization id" }, { status: 400 });
    }
    const org = await prisma.organization.delete({
      where: { id: orgId },
      select: { id: true, name: true, ownerId: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json(org);
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

