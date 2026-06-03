import { Router } from "express";
import healthRouter from "./health.routes.js";
import authRouter from "./auth.routes.js";
import recetaRouter from "./receta.routes.js";
import {
  comentarioNestedRouter,
  comentarioRootRouter,
} from "./comentario.routes.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/recetas", recetaRouter);
router.use("/recetas/:recetaId/comentarios", comentarioNestedRouter);
router.use("/comentarios", comentarioRootRouter);

export default router;
