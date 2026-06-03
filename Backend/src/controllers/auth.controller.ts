import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const usuario = await authService.register(req.body);
    res.status(201).json({ message: "Usuario registrado", usuario });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al registrar";
    res.status(400).json({ message: msg });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { token, usuario } = await authService.login(req.body);
    res.json({ token, usuario });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al iniciar sesión";
    res.status(401).json({ message: msg });
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  try {
    const usuario = await authService.getMe(req.usuario!.id);
    if (!usuario) { res.status(404).json({ message: "Usuario no encontrado" }); return; }
    res.json({ usuario });
  } catch {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
