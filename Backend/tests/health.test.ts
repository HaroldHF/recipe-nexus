import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Health API", () => {
  it("should return ok status on /api/health", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("timestamp");
  });
});
