import { Request, Response } from "express";
import * as comentarioService from "../services/comentario.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

export async function getByReceta(req: Request, res: Response): Promise<void> {
  const comentarios = await comentarioService.getComentariosByReceta(req.params.recetaId);
  res.json(comentarios);
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  const comentario = await comentarioService.createComentario(
    req.body.contenido,
    req.userId!,
    req.params.recetaId
  );
  res.status(201).json(comentario);
}

export async function remove(req: AuthRequest, res: Response): Promise<void> {
  const comentario = await comentarioService.deleteComentario(req.params.id, req.userId!);
  if (!comentario) { res.status(404).json({ message: "Comentario no encontrado o sin permiso" }); return; }
  res.json({ message: "Comentario eliminado" });
}
