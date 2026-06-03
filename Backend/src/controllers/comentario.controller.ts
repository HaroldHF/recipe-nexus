import type { Request, Response } from "express";
import * as comentarioService from "../services/comentario.service.js";
import { crearComentarioSchema } from "../validators/comentario.validator.js";

export async function getByReceta(req: Request, res: Response): Promise<void> {
  try {
    const comentarios = await comentarioService.getComentariosByReceta(req.params.recetaId as string);
    res.json(comentarios);
  } catch {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  const parsed = crearComentarioSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Datos inválidos",
      errors: parsed.error.issues.map((e) => ({
        campo: e.path.join("."),
        mensaje: e.message,
      })),
    });
    return;
  }

  try {
    const comentario = await comentarioService.createComentario(
      parsed.data.texto,
      parsed.data.calificacion,
      req.usuario!.id,
      req.params.recetaId as string
    );
    res.status(201).json(comentario);
  } catch {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const comentario = await comentarioService.deleteComentario(req.params.id as string, req.usuario!.id);
    if (!comentario) { res.status(404).json({ message: "Comentario no encontrado o sin permiso" }); return; }
    res.json({ message: "Comentario eliminado" });
  } catch {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
