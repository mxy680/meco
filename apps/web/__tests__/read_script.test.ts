describe('POST /api/container/script/read', () => {
  let containerId: string;
  const scriptName = 'read_test_script';
  const scriptContent = 'print("Read test!")';

  beforeAll(async () => {
    // Start a new container for testing
    const res = await fetch('http://localhost:8080/api/container/start');
    const data = await res.json() as { id: string };
    containerId = data.id;
    expect(containerId).toBeTruthy();

    // Create the script to be read
    const createRes = await fetch('http://localhost:8080/api/container/script/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ container_id: containerId, name: scriptName, content: scriptContent }),
    });
    expect(createRes.status).toBe(200);
  });

  it('should read the script and return its content', async () => {
    const res = await fetch('http://localhost:8080/api/container/script/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ container_id: containerId, name: scriptName }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('ok', true);
    expect(data).toHaveProperty('path');
    expect(typeof data.path).toBe('string');
    expect(data.path.endsWith(`${scriptName}.py`)).toBe(true);
    expect(data).toHaveProperty('content');
    expect(data.content).toContain(scriptContent);
  });

  it('should fail if name is missing', async () => {
    const res = await fetch('http://localhost:8080/api/container/script/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ container_id: containerId }),
    });
    expect(res.status).toBe(400);
  });

  it('should fail if container_id is missing', async () => {
    const res = await fetch('http://localhost:8080/api/container/script/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: scriptName }),
    });
    expect(res.status).toBe(400);
  });
});
