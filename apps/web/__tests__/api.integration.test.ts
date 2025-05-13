jest.setTimeout(30000);

describe("Go API integration", () => {
  it("should create and stop a container", async () => {
    let containerId: string | undefined;
    try {
      // Start the container
      console.log('Calling API: GET /api/container/start');
      const startResp = await fetch("http://localhost:8080/api/container/start");
      const startData = await startResp.json();
      console.log('RESPONSE:', startResp.status, startData);
      expect(startResp.status).toBe(200);
      expect(startData).toHaveProperty("id");
      expect(typeof startData.id).toBe("string");
      containerId = startData.id;

      // Stop the container
      console.log('Calling API: POST /api/container/stop?id=' + containerId);
      const stopResp = await fetch(`http://localhost:8080/api/container/stop?id=${containerId}`, { method: 'POST' });
      const stopData = await stopResp.json();
      console.log('STOP RESPONSE:', stopResp.status, stopData);
      expect(stopResp.status).toBe(200);
      expect(stopData).toHaveProperty("ok", true);
    } catch (err) {
      if (err instanceof Error) {
        console.error('Jest error:', err.message);
      } else {
        console.error('Unknown error:', err);
      }
      throw err;
    }
  });
});
