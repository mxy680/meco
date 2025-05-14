describe('POST /api/container/script/create', () => {
  let containerId: string;

  beforeAll(async () => {
    // Start a new container for testing
    const res = await fetch('http://localhost:8080/api/container/start');
    const data = await res.json() as { id: string };
    containerId = data.id;
    expect(containerId).toBeTruthy();
  });

  it('should create a script and return success', async () => {
    const scriptName = 'test_script'; // intentionally no .py
    const scriptContent = 'print("Hello from script!")';
    const res = await fetch('http://localhost:8080/api/container/script/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ container_id: containerId, name: scriptName, content: scriptContent }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('ok', true);
    expect(data).toHaveProperty('path');
    expect(typeof data.path).toBe('string');
    expect(data.path.endsWith('test_script.py')).toBe(true);
  });

  it('should create an empty script if content is omitted', async () => {
    const scriptName = 'empty_script';
    const res = await fetch('http://localhost:8080/api/container/script/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ container_id: containerId, name: scriptName }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('ok', true);
    expect(data).toHaveProperty('path');
    expect(typeof data.path).toBe('string');
    expect(data.path.endsWith('empty_script.py')).toBe(true);
  });

  it('should fail if name is missing', async () => {
    const res = await fetch('http://localhost:8080/api/container/script/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ container_id: containerId, content: 'print(123)' }),
    });
    expect(res.status).toBe(400);
  });
});
