// Utility to start a container and return its id
type StartContainerResponse = { id: string };
type KernelResponse = { id: string };
type KernelInfo = { id: string; name?: string; last_activity?: string; execution_state?: string; connections?: number };

async function startContainer(): Promise<string> {
  const res: Response = await fetch('http://localhost:8080/api/container/start');
  const data: StartContainerResponse = await res.json();
  if (!data.id) throw new Error('Failed to start container');
  return data.id;
}

describe('Kernel Gateway API', () => {
  let containerId: string;

  beforeAll(async () => {
    containerId = await startContainer();
  });

  it('should create a kernel, get its info, interrupt, restart, and delete it', async () => {
    // Create a kernel
    const createRes: Response = await fetch(`http://localhost:8080/api/container/kernel?id=${containerId}`, {
      method: 'POST',
    });
    expect(createRes.status).toBeGreaterThanOrEqual(200);
    expect(createRes.status).toBeLessThan(300);
    const created: KernelResponse = await createRes.json();
    expect(created.id).toBeDefined();
    expect(typeof created.id).toBe('string');

    // Get kernel info
    const infoRes: Response = await fetch(`http://localhost:8080/api/kernels/info?id=${containerId}&kernel_id=${created.id}`);
    expect(infoRes.status).toBe(200);
    const info: KernelInfo = await infoRes.json();
    expect(info.id).toBe(created.id);
    expect(typeof info.id).toBe('string');

    // Interrupt the kernel
    const interruptRes: Response = await fetch(`http://localhost:8080/api/kernels/interrupt?id=${containerId}&kernel_id=${created.id}`, {
      method: 'POST',
    });
    expect(interruptRes.status).toBe(204);

    // Restart the kernel
    const restartRes: Response = await fetch(`http://localhost:8080/api/kernels/restart?id=${containerId}&kernel_id=${created.id}`, {
      method: 'POST',
    });
    expect(restartRes.status).toBe(200);
    const restarted: KernelInfo = await restartRes.json();
    expect(restarted.id).toBe(created.id);

    // Delete the kernel
    const deleteRes: Response = await fetch(`http://localhost:8080/api/kernels/delete?id=${containerId}&kernel_id=${created.id}`, {
      method: 'DELETE',
    });
    expect(deleteRes.status).toBe(204);
  });
});
