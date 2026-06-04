import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(uri);
};

const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

const closeDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});

beforeEach(async () => {
  await clearDB();
});

describe("Auth DB API", () => {
  it("should register a new user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send({
      nombre: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Usuario registrado");
  });

  it("should not register a user with an existing email", async () => {
    await request(app).post("/api/auth/register").send({
      nombre: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/register").send({
      nombre: "Test User 2",
      email: "test@example.com",
      password: "password1234",
    });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "El email ya está registrado");
  });

  it("should login successfully and return a token", async () => {
    await request(app).post("/api/auth/register").send({
      nombre: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.usuario).toHaveProperty("email", "test@example.com");
  });

  it("should return profile data on /api/auth/me with valid token", async () => {
    await request(app).post("/api/auth/register").send({
      nombre: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    const token = loginRes.body.token;

    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.usuario).toHaveProperty("email", "test@example.com");
    expect(meRes.body.usuario).toHaveProperty("nombre", "Test User");
  });
});
