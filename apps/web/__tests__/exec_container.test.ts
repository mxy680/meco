// This test assumes there is a running container created by the API and its ID is known.
// For a robust test, you may want to start a container first, then exec into it.

type StartContainerResponse = { id: string };
type ExecResponse = { output: string };

describe('POST /api/container/exec', () => {
  let containerId: string;

  beforeAll(async () => {
    // Start a new container for testing
    const res = await fetch('http://localhost:8080/api/container/start');
    const data = await res.json() as StartContainerResponse;
    containerId = data.id;
    expect(containerId).toBeTruthy();
  });

  // afterAll(async () => {
  //   // Stop the container
  //   if (containerId) {
  //     await fetch(`http://localhost:8080/api/container/stop?id=${containerId}`, { method: 'POST' });
  //   }
  // });

  it('should execute a command inside the container and return output', async () => {
    const cmd = ['echo', 'hello-from-container'];
    const res = await fetch(`http://localhost:8080/api/container/exec?id=${containerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cmd }),
    });
    expect(res.status).toBe(200);
    const data = await res.json() as ExecResponse;
    expect(data.output).toContain('hello-from-container');
  });
});
