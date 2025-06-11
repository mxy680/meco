import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/user/project/chat/attachment
 * Fetch an attachment by id (?id=) or all attachments for a chat (?chatId=).
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const chatId = searchParams.get("chatId");
        if (id) {
            const attachment = await prisma.attachment.findUnique({ where: { id } });
            if (!attachment) return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
            return NextResponse.json(attachment);
        } else if (chatId) {
            const attachments = await prisma.attachment.findMany({ where: { chatId } });
            return NextResponse.json(attachments);
        } else {
            return NextResponse.json({ error: "Missing id or chatId query param" }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch attachment(s)" }, { status: 500 });
    }
}

/**
 * POST /api/user/project/chat/attachment
 * Create a new attachment. Expects chatId, url, name, type, size.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { chatId, url, name, type, size } = body;
        if (!chatId || !url || !name || !type || !size) {
            // Debugging aid: log and return the received body to diagnose 400 errors
            console.error("Attachment POST missing fields", { chatId, url, name, type, size, body });
            return NextResponse.json({ error: "Missing required fields", received: { chatId, url, name, type, size } }, { status: 400 });
        }
        const attachment = await prisma.attachment.create({
            data: { chatId, url, name, type, size },
        });
        return NextResponse.json(attachment, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create attachment" }, { status: 500 });
    }
}

/**
 * DELETE /api/user/project/chat/attachment
 * Delete an attachment by id. Expects id in body.
 */
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;
        if (!id) {
            return NextResponse.json({ error: "Missing attachment id" }, { status: 400 });
        }
        const deleted = await prisma.attachment.delete({ where: { id } });
        return NextResponse.json(deleted);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete attachment" }, { status: 500 });
    }
}