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

let token: string;
let userId: string;

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});

beforeEach(async () => {
  await clearDB();
  
  // Register and login a user to get a token for protected routes
  await request(app).post("/api/auth/register").send({
    nombre: "Recipe Author",
    email: "author@example.com",
    password: "password123",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "author@example.com",
    password: "password123",
  });
  
  token = loginRes.body.token;
  userId = loginRes.body.usuario._id;
});

describe("Recetas API", () => {
  const sampleReceta = {
    titulo: "Pastel de Chocolate",
    descripcion: "Un delicioso pastel de chocolate",
    categoria: "Postre",
    tiempoMin: 45,
    porciones: 8,
    dificultad: "Fácil",
    ingredientes: [
      { nombre: "Harina", cantidad: "2", unidad: "tazas" },
      { nombre: "Cacao", cantidad: "1", unidad: "taza" }
    ],
    pasos: ["Mezclar ingredientes", "Hornear por 30 mins"]
  };

  it("should create a new recipe", async () => {
    const res = await request(app)
      .post("/api/recetas")
      .set("Authorization", `Bearer ${token}`)
      .send(sampleReceta);
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.titulo).toBe(sampleReceta.titulo);
  });

  it("should get all recipes", async () => {
    // Create one recipe first
    await request(app)
      .post("/api/recetas")
      .set("Authorization", `Bearer ${token}`)
      .send(sampleReceta);

    const res = await request(app).get("/api/recetas");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].titulo).toBe(sampleReceta.titulo);
  });

  it("should get a recipe by ID", async () => {
    const createRes = await request(app)
      .post("/api/recetas")
      .set("Authorization", `Bearer ${token}`)
      .send(sampleReceta);
    
    const id = createRes.body._id;

    const res = await request(app).get(`/api/recetas/${id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(id);
    expect(res.body.titulo).toBe(sampleReceta.titulo);
  });

  it("should update a recipe if the user is the author", async () => {
    const createRes = await request(app)
      .post("/api/recetas")
      .set("Authorization", `Bearer ${token}`)
      .send(sampleReceta);
    
    const id = createRes.body._id;

    const res = await request(app)
      .put(`/api/recetas/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ ...sampleReceta, titulo: "Pastel Editado" });
    
    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe("Pastel Editado");
  });

  it("should delete a recipe if the user is the author", async () => {
    const createRes = await request(app)
      .post("/api/recetas")
      .set("Authorization", `Bearer ${token}`)
      .send(sampleReceta);
    
    const id = createRes.body._id;

    const res = await request(app)
      .delete(`/api/recetas/${id}`)
      .set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(200);

    // Verify it's deleted
    const getRes = await request(app).get(`/api/recetas/${id}`);
    expect(getRes.status).toBe(404);
  });
});
