import { Router } from "express";
import { register, login, me, update } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = Router();

// POST /api/auth/register
router.post("/register", validate(registerSchema), register);

// POST /api/auth/login
router.post("/login", validate(loginSchema), login);

// GET /api/auth/me  (requiere auth)
router.get("/me", authMiddleware, me);

// PUT /api/auth/me  (requiere auth)
router.put("/me", authMiddleware, update);

export default router;
