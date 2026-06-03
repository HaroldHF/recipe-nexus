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
let recetaId: string;

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});

beforeEach(async () => {
  await clearDB();
  
  // Register and login a user to get a token
  await request(app).post("/api/auth/register").send({
    nombre: "Comment User",
    email: "commenter@example.com",
    password: "password123",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "commenter@example.com",
    password: "password123",
  });
  
  token = loginRes.body.token;

  // Create a recipe to comment on
  const createRecetaRes = await request(app)
    .post("/api/recetas")
    .set("Authorization", `Bearer ${token}`)
    .send({
      titulo: "Receta para Comentar",
      descripcion: "Una buena descripcion",
      categoria: "Desayuno",
      tiempoMin: 10,
      porciones: 1,
      dificultad: "Fácil",
      ingredientes: [{ nombre: "Pan", cantidad: "1", unidad: "pieza" }],
      pasos: ["Tostar"]
    });
    
  recetaId = createRecetaRes.body._id;
});

describe("Comentarios API", () => {
  it("should add a comment to a recipe", async () => {
    const res = await request(app)
      .post(`/api/recetas/${recetaId}/comentarios`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        texto: "¡Muy buena receta!",
        calificacion: 5
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.texto).toBe("¡Muy buena receta!");
    expect(res.body.calificacion).toBe(5);
  });

  it("should get all comments for a recipe", async () => {
    await request(app)
      .post(`/api/recetas/${recetaId}/comentarios`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        texto: "¡Excelente!",
        calificacion: 4
      });

    const res = await request(app).get(`/api/recetas/${recetaId}/comentarios`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].texto).toBe("¡Excelente!");
  });

  it("should delete a comment if the user is the author", async () => {
    const createRes = await request(app)
      .post(`/api/recetas/${recetaId}/comentarios`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        texto: "A borrar",
        calificacion: 1
      });
      
    const comentarioId = createRes.body._id;

    const res = await request(app)
      .delete(`/api/comentarios/${comentarioId}`)
      .set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(200);

    // Verify it's deleted
    const getRes = await request(app).get(`/api/recetas/${recetaId}/comentarios`);
    expect(getRes.body.length).toBe(0);
  });
});
