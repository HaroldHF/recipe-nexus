import { Request, Response } from "express";
import * as recetaService from "../services/receta.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

export async function getAll(_req: Request, res: Response): Promise<void> {
  const recetas = await recetaService.getAllRecetas();
  res.json(recetas);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const receta = await recetaService.getRecetaById(req.params.id);
  if (!receta) { res.status(404).json({ message: "Receta no encontrada" }); return; }
  res.json(receta);
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  const receta = await recetaService.createReceta(req.body, req.userId!);
  res.status(201).json(receta);
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  const receta = await recetaService.updateReceta(req.params.id, req.body, req.userId!);
  if (!receta) { res.status(404).json({ message: "Receta no encontrada o sin permiso" }); return; }
  res.json(receta);
}

export async function remove(req: AuthRequest, res: Response): Promise<void> {
  const receta = await recetaService.deleteReceta(req.params.id, req.userId!);
  if (!receta) { res.status(404).json({ message: "Receta no encontrada o sin permiso" }); return; }
  res.json({ message: "Receta eliminada" });
}
