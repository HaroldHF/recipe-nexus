import { Router } from "express";
import { getByReceta, create, remove } from "../controllers/comentario.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// Rutas anidadas bajo /api/recetas/:recetaId/comentarios
// (mergeParams hereda :recetaId del router padre)
export const comentarioNestedRouter = Router({ mergeParams: true });

// GET /api/recetas/:recetaId/comentarios
comentarioNestedRouter.get("/", getByReceta);

// POST /api/recetas/:recetaId/comentarios  (requiere auth)
comentarioNestedRouter.post("/", authMiddleware, create);

// Rutas raíz bajo /api/comentarios
export const comentarioRootRouter = Router();

// DELETE /api/comentarios/:id  (requiere auth, solo el autor)
comentarioRootRouter.delete("/:id", authMiddleware, remove);
