describe('Kernel Execute API', () => {
  let containerId: string;
  let kernelId: string;

  beforeAll(async () => {
    // Create a container and kernel (assume these endpoints are available and working)
    // You may need to adjust these to match your actual API and test setup
    // Create container
    const containerRes = await fetch('http://localhost:8080/api/container/start', { method: 'GET' });
    const containerText = await containerRes.text();
    console.log('Container start response:', containerText);
    if (!containerRes.ok) {
      throw new Error(`API error: ${containerRes.status} ${containerRes.statusText} - ${containerText}`);
    }
    let container;
    try {
      container = JSON.parse(containerText);
    } catch {
      throw new Error(`Failed to parse JSON: ${containerText}`);
    }
    containerId = container.id;

    // Create kernel
    const kernelRes = await fetch(`http://localhost:8080/api/container/kernel?id=${containerId}`, { method: 'POST' });
    const kernelText = await kernelRes.text();
    console.log('Kernel create response:', kernelText);
    if (!kernelRes.ok) {
      throw new Error(`API error: ${kernelRes.status} ${kernelRes.statusText} - ${kernelText}`);
    }
    let kernel;
    try {
      kernel = JSON.parse(kernelText);
    } catch {
      throw new Error(`Failed to parse JSON: ${kernelText}`);
    }
    kernelId = kernel.id;
  });

  afterAll(async () => {
    // Clean up: delete kernel and container
    await fetch(`http://localhost:8080/api/kernels/delete?id=${containerId}&kernel_id=${kernelId}`, { method: 'DELETE' });
    await fetch(`http://localhost:8080/api/containers/delete?id=${containerId}`, { method: 'DELETE' });
  });

  it('should execute code and return the result', async () => {
    const res = await fetch(
      `http://localhost:8080/api/kernels/execute?id=${containerId}&kernel_id=${kernelId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'print(1+1)' })
      }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    console.log(data);
    expect(data.output).toContain('2');
  });

  it('should return error for missing code', async () => {
    const res = await fetch(
      `http://localhost:8080/api/kernels/execute?id=${containerId}&kernel_id=${kernelId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      }
    );
    expect(res.status).toBe(400);
  });
});
