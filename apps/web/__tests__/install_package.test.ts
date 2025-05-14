describe('POST /api/container/install', () => {
  it('should install a package and return success', async () => {
    // Start a container to get a valid container ID
    const startRes = await fetch('http://localhost:8080/api/container/start');
    expect(startRes.status).toBe(200);
    const startData = await startRes.json();
    const containerId = startData.id;
    expect(containerId).toBeTruthy();

    const packageName = 'numpy';
    const installRes = await fetch(`http://localhost:8080/api/container/install?id=${containerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ package: packageName }),
    });
    expect(installRes.status).toBe(200);
    const installData = await installRes.json();
    expect(installData).toHaveProperty('output'); // Output from pip install
    expect(typeof installData.output).toBe('string');
  });
});
