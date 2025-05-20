describe('POST /api/container/script/edit', () => {
  let containerId: string;
  const originalScriptName = 'edit_test_script';
  const originalContent = 'print("Original content")';
  const newContent = 'print("Edited content!")';

  beforeAll(async () => {
    // Start a new container for testing
    const res = await fetch('http://localhost:8080/api/container/start');
    const data = await res.json() as { id: string };
    containerId = data.id;
    expect(containerId).toBeTruthy();

    // Create the original script first
    const createRes = await fetch('http://localhost:8080/api/container/script/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ container_id: containerId, name: originalScriptName, content: originalContent }),
    });
    expect(createRes.status).toBe(200);
  });

  it('should edit an existing script and return success', async () => {
    const res = await fetch('http://localhost:8080/api/container/script/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ container_id: containerId, name: originalScriptName, content: newContent }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('ok', true);
    expect(data).toHaveProperty('path');
    expect(typeof data.path).toBe('string');
    expect(data.path.endsWith(`${originalScriptName}.py`)).toBe(true);
  });

  it('should fail if name is missing', async () => {
    const res = await fetch('http://localhost:8080/api/container/script/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ container_id: containerId, content: newContent }),
    });
    expect(res.status).toBe(400);
  });

  it('should fail if content is missing', async () => {
    const res = await fetch('http://localhost:8080/api/container/script/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ container_id: containerId, name: originalScriptName }),
    });
    expect(res.status).toBe(400);
  });
});
