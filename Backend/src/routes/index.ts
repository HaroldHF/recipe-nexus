import { Router } from "express";
import healthRouter from "./health.routes.js";
import authRouter from "./auth.routes.js";
import recetaRouter from "./receta.routes.js";
import comentarioRouter from "./comentario.routes.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/recetas", recetaRouter);
router.use("/recetas/:recetaId/comentarios", comentarioRouter);

export default router;
