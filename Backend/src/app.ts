import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();

// Middlewares globales
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Rutas de la API
app.use("/api", router);

export default app;
