import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Attachment } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, userId, content, attachments } = body;
    if (!projectId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // 1. Create chat (without files)
    const chat = await prisma.chat.create({
      data: {
        projectId,
        userId,
        content,
      },
    });
    // 2. If attachments provided, create Attachment records
    let createdAttachments: Attachment[] = [];
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      createdAttachments = await Promise.all(
        attachments.map((att: Attachment) =>
          prisma.attachment.create({
            data: {
              chatId: chat.id,
              url: att.url,
              name: att.name,
              type: att.type,
              size: att.size,
            },
          })
        )
      );
    }
    // 3. Return chat with attachments
    return NextResponse.json({ ...chat, attachments: createdAttachments }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
  }
}

