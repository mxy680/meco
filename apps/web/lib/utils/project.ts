import { Project } from "@prisma/client";

/**
 * Fetch all projects for a user by userId.
 */
export async function getProjects(userId: string): Promise<Project[]> {
  const res = await fetch(`/api/user/project?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

/**
 * Fetch a single project by id. (You may need to implement this route if not present.)
 */
export async function getProject(id: string): Promise<Project> {
  const res = await fetch(`/api/user/project?id=${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
}

/**
 * Create a new project.
 */
export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  const res = await fetch('/api/user/project', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

/**
 * Update a project by id. Accepts any updatable fields.
 */
export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const res = await fetch('/api/user/project', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

/**
 * Delete a project by id.
 */
export async function deleteProject(id: string): Promise<Project> {
  const res = await fetch('/api/user/project', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Failed to delete project');
  return res.json();
}
