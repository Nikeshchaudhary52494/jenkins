const request = require("supertest");
const { app, greeting } = require("./app");

describe("App Logic Tests", () => {
  test("Greeting function works", () => {
    expect(greeting("Nikesh")).toBe("Hello, Nikesh! 🚀");
  });

  test("Root route returns 200 OK", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });

  test("Status API returns JSON UP", async () => {
    const response = await request(app).get("/status");
    expect(response.body.status).toBe("UP");
  });
});