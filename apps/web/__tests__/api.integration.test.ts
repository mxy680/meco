

describe("Go API integration", () => {
  it("should create a container", async () => {
    try {
      console.log('Calling API: GET /api/container');
      const resp = await fetch("http://localhost:8080/api/container");
      const data = await resp.json();
      console.log('RESPONSE:', resp.status, data);
      expect(resp.status).toBe(200);
      expect(data).toHaveProperty("id");
      expect(typeof data.id).toBe("string");
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
