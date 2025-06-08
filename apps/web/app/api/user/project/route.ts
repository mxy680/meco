import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, userId, organizationId } = body;
    if (!name || !organizationId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const project = await prisma.project.create({
      data: {
        name,
        userId,
        organizationId,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
