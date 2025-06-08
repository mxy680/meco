import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import crypto from "crypto";

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

