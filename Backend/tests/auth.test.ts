import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Auth API", () => {
  describe("POST /api/auth/register", () => {
    it("should return 400 if validation fails (empty body)", async () => {
      const res = await request(app).post("/api/auth/register").send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Datos inválidos");
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it("should return 400 if email is invalid", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          nombre: "Juan",
          email: "not-an-email",
          password: "password123",
        });
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ campo: "email" }),
        ])
      );
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 400 if body is empty", async () => {
      const res = await request(app).post("/api/auth/login").send({});
      expect(res.status).toBe(400);
    });
  });
});
