import { Router } from "express";
import { getAll, getById, create, update, remove } from "../controllers/receta.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { crearRecetaSchema, editarRecetaSchema } from "../validators/receta.validator.js";

const router = Router();

// GET /api/recetas
router.get("/", getAll);

// GET /api/recetas/:id
router.get("/:id", getById);

// POST /api/recetas  (requiere auth)
router.post("/", authMiddleware, validate(crearRecetaSchema), create);

// PUT /api/recetas/:id  (requiere auth)
router.put("/:id", authMiddleware, validate(editarRecetaSchema), update);

// DELETE /api/recetas/:id  (requiere auth)
router.delete("/:id", authMiddleware, remove);

export default router;
