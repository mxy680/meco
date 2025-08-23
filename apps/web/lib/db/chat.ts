import { Chat, Attachment } from "@prisma/client";

export interface AttachmentInput {
    url: string;
    name: string;
    type: string;
    size: number;
}

export interface ChatWithAttachments extends Chat {
    attachments: Attachment[];
}

/**
 * Fetch all chats for a project by projectId.
 */
export async function getChats(projectId: string): Promise<Chat[]> {
    const res = await fetch(`/api/user/project/chat?projectId=${encodeURIComponent(projectId)}`);
    if (!res.ok) throw new Error('Failed to fetch chats');
    return res.json();
}

/**
 * Fetch a single chat by id. (You may need to implement this route if not present.)
 */
export async function getChat(id: string): Promise<Chat> {
    const res = await fetch(`/api/user/project/chat?id=${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to fetch chat');
    return res.json();
}

/**
 * Fetch attachments for a given chat by chatId.
 */
export async function getAttachmentsByChatId(chatId: string): Promise<Attachment[]> {
    const res = await fetch(`/api/user/project/chat/attachment?chatId=${encodeURIComponent(chatId)}`);
    if (!res.ok) throw new Error('Failed to fetch attachments');
    return res.json();
}

/**
 * Create a new chat, optionally with attachments.
 * @param data Chat fields (projectId, userId, content)
 * @param attachments Optional array of attachment objects
 * @returns Chat with attachments array
 */
export async function createChat(
    data: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>,
    attachments?: AttachmentInput[]
): Promise<ChatWithAttachments> {
    // 1. Create chat
    const res = await fetch('/api/user/project/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create chat');
    const chat = await res.json();
    let createdAttachments: Attachment[] = [];
    // 2. Create attachments if provided
    if (attachments && attachments.length > 0) {
        createdAttachments = await Promise.all(
            attachments.map(att => fetch('/api/user/project/chat/attachment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...att, chatId: chat.id })
            }).then(r => {
                if (!r.ok) throw new Error('Failed to create attachment');
                return r.json() as Promise<Attachment>;
            }))
        );
    }
    return { ...chat, attachments: createdAttachments };
}

/**
 * Update a chat by id. Optionally replaces all attachments.
 * @param id Chat id
 * @param data Updatable chat fields
 * @param attachments Optional new attachments array (replaces all existing)
 * @returns Chat with attachments array
 */
export async function updateChat(
    id: string,
    data: Partial<Chat>,
    attachments?: AttachmentInput[]
): Promise<ChatWithAttachments> {
    // 1. Update chat
    const res = await fetch('/api/user/project/chat', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) throw new Error('Failed to update chat');
    const chat = await res.json();
    let updatedAttachments: Attachment[] = [];
    if (attachments) {
        // Remove all existing attachments, then add new ones
        // 1. Get all current attachments
        const current = await fetch(`/api/user/project/chat/attachment?chatId=${encodeURIComponent(id)}`);
        if (!current.ok) throw new Error('Failed to fetch existing attachments');
        const currentAttachments: Attachment[] = await current.json();
        // 2. Delete all current attachments
        await Promise.all(currentAttachments.map(att => fetch('/api/user/project/chat/attachment', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: att.id })
        })));
        // 3. Create new attachments
        updatedAttachments = await Promise.all(
            attachments.map(att => fetch('/api/user/project/chat/attachment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...att, chatId: id })
            }).then(r => {
                if (!r.ok) throw new Error('Failed to create attachment');
                return r.json() as Promise<Attachment>;
            }))
        );
    } else {
        // If not updating attachments, fetch existing
        const res = await fetch(`/api/user/project/chat/attachment?chatId=${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error('Failed to fetch attachments');
        updatedAttachments = await res.json() as Attachment[];
    }
    return { ...chat, attachments: updatedAttachments };
}

/**
 * Delete a chat by id.
 */
export async function deleteChat(id: string): Promise<Chat> {
    const res = await fetch('/api/user/project/chat', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Failed to delete chat');
    return res.json();
}