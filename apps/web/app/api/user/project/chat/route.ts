import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/user/project/chat
 * Fetch a chat by id (?id=) or all chats for a project (?projectId=).
 * Returns chat(s).
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("id");
    const projectId = searchParams.get("projectId");
    if (chatId) {
      // Fetch single chat
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
      });
      if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      return NextResponse.json(chat);
    } else if (projectId) {
      // Fetch all chats for a project
      const chats = await prisma.chat.findMany({
        where: { projectId },
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json(chats);
    } else {
      return NextResponse.json({ error: "Missing id or projectId query param" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch chat(s)" }, { status: 500 });
  }
}

/**
 * POST /api/user/project/chat
 * Create a new chat (optionally with attachments).
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, userId, content, role } = body;
    if (!projectId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Create chat
    const chat = await prisma.chat.create({
      data: {
        projectId,
        userId,
        content,
        role: role ?? "user",
      },
    });
    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
  }
}

/**
 * PUT /api/user/project/chat
 * Update a chat by id. Expects id and any updatable fields (content, attachments).
 * If attachments are provided, replaces all attachments.
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, content } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing chat id" }, { status: 400 });
    }
    // Update chat content
    const updatedChat = await prisma.chat.update({
      where: { id },
      data: { ...(content && { content }) },
    });
    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update chat" }, { status: 500 });
  }
}

/**
 * DELETE /api/user/project/chat
 * Delete a chat by id. Expects id in the body.
 */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing chat id" }, { status: 400 });
    }
    // Delete chat
    const deletedChat = await prisma.chat.delete({
      where: { id },
    });
    return NextResponse.json(deletedChat);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete chat" }, { status: 500 });
  }
}

