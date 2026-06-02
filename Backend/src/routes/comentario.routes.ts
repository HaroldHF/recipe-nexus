import { Router } from "express";
import { getByReceta, create, remove } from "../controllers/comentario.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true }); // hereda :recetaId del router padre

// GET /api/recetas/:recetaId/comentarios
router.get("/", getByReceta);

// POST /api/recetas/:recetaId/comentarios  (requiere auth)
router.post("/", authMiddleware, create);

// DELETE /api/recetas/:recetaId/comentarios/:id  (requiere auth)
router.delete("/:id", authMiddleware, remove);

export default router;
