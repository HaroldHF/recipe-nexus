import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = Router();

// POST /api/auth/register
router.post("/register", validate(registerSchema), register);

// POST /api/auth/login
router.post("/login", validate(loginSchema), login);

export default router;
