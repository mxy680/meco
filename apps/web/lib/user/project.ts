import { Project, Chat } from "@prisma/client";

export type ProjectInput = {
  name: string;
  organizationId: string;
  userId: string;
};

export async function getOrCreateProject(input: ProjectInput): Promise<Project | null> {
  try {
    const res = await fetch("/api/user/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to create project");
    return await res.json() as Project;
  } catch (err) {
    console.error("getOrCreateProject error:", err);
    return null;
  }
}

export type ChatInput = {
  projectId: string;
  userId: string;
  content: string;
  attachments: {
    url: string;
    name: string;
    type: string;
    size: number;
  }[];
};

export async function createChat(input: ChatInput): Promise<Chat | null> {
  try {
    const res = await fetch("/api/user/project/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to create chat");
    return await res.json() as Chat;
  } catch (err) {
    console.error("createChat error:", err);
    return null;
  }
}
