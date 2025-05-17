describe('POST /api/container/notebook/read', () => {
  let containerId: string;
  const notebookName = 'main.ipynb';

  beforeAll(async () => {
    // Start a new container for testing
    const res = await fetch('http://localhost:8080/api/container/start');
    const data: { id: string } = await res.json();
    containerId = data.id;
    expect(containerId).toBeTruthy();

    // Add a code cell using the add_cell API
    const cellSource = 'print("Hello from cell!")';
    const addCellRes = await fetch('http://localhost:8080/api/container/notebook/add_cell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        container_id: containerId,
        cell_type: 'code',
        source: cellSource
      })
    });
    expect(addCellRes.status).toBe(200);
  });

  it('should read the notebook and return its content', async () => {
    const res = await fetch('http://localhost:8080/api/container/notebook/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ container_id: containerId }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('ok', true);
    expect(data).toHaveProperty('path');
    expect(typeof data.path).toBe('string');
    expect(data.path.endsWith(notebookName)).toBe(true);
    expect(data).toHaveProperty('content');
    // Parse the notebook JSON and check the cell was added
    const nb = JSON.parse(data.content.trim());
    expect(nb.cells.length).toBe(1);
    expect(nb.cells[0].cell_type).toBe('code');
    expect(nb.cells[0].source.join('')).toContain('print("Hello from cell!")');
  });


  it('should fail if container_id is missing', async () => {
    const res = await fetch('http://localhost:8080/api/container/notebook/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: notebookName }),
    });
    expect(res.status).toBe(400);
  });
});
