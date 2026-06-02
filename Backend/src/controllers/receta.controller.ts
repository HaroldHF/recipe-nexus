import type { Request, Response } from "express";
import * as recetaService from "../services/receta.service.js";

export async function getAll(_req: Request, res: Response): Promise<void> {
  try {
    const recetas = await recetaService.getAllRecetas();
    res.json(recetas);
  } catch {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const receta = await recetaService.getRecetaById(req.params.id as string);
    if (!receta) { res.status(404).json({ message: "Receta no encontrada" }); return; }
    res.json(receta);
  } catch {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const receta = await recetaService.createReceta(req.body, req.usuario!.id);
    res.status(201).json(receta);
  } catch {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const receta = await recetaService.updateReceta(req.params.id as string, req.body, req.usuario!.id);
    if (!receta) { res.status(404).json({ message: "Receta no encontrada o sin permiso" }); return; }
    res.json(receta);
  } catch {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const receta = await recetaService.deleteReceta(req.params.id as string, req.usuario!.id);
    if (!receta) { res.status(404).json({ message: "Receta no encontrada o sin permiso" }); return; }
    res.json({ message: "Receta eliminada" });
  } catch {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
