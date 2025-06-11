// API route for managing user projects
// Supports GET, POST, PUT, and DELETE methods
// Uses Prisma ORM for database operations and Next.js API conventions

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * GET /api/user/project?userId=...
 * Fetch all projects for a given userId (from query string).
 * Returns an array of project objects.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const projects = await prisma.project.findMany({ where: { userId } });
    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

/**
 * POST /api/user/project
 * Create a new project for a user. Expects JSON body with name, userId, organizationId.
 * Uses a deterministic hash to generate the project id based on userId, organizationId, and createdAt.
 * Returns the created project object.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, userId, organizationId } = body;
    if (!name || !userId || !organizationId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // 1. Create the project to get createdAt
    const createdProject = await prisma.project.create({
      data: {
        name,
        userId,
        organizationId,
      },
    });
    // 2. Generate deterministic project ID
    const input = `${userId}:${organizationId}:${new Date(createdProject.createdAt).toISOString()}`;
    const deterministicId = crypto.createHash("sha256").update(input).digest("hex").slice(0, 24);
    // 3. Update the project with the deterministic ID
    const project = await prisma.project.update({
      where: { id: createdProject.id },
      data: { id: deterministicId },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

/**
 * PUT /api/user/project
 * Update a project by id. Expects JSON body with id (required), and optionally name and organizationId.
 * Returns the updated project object.
 */
/**
 * PUT /api/user/project
 * Update a project by id. Accepts any updatable field in the Project model (except id for the where clause).
 * Expects JSON body with id and any fields to update.
 * Returns the updated project object.
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...dataToUpdate } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing project id" }, { status: 400 });
    }
    // Remove id from update fields if present
    delete dataToUpdate.id;
    const updatedProject = await prisma.project.update({
      where: { id },
      data: dataToUpdate,
    });
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

/**
 * DELETE /api/user/project
 * Delete a project by id. Expects JSON body with id.
 * Returns the deleted project object.
 */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing project id" }, { status: 400 });
    }
    const deletedProject = await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json(deletedProject);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}

