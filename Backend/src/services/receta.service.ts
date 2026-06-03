import { Receta } from "../models/receta.model.js";
import type { CrearRecetaDto, EditarRecetaDto } from "../validators/receta.validator.js";

export async function getAllRecetas() {
  return Receta.find().populate("autor", "nombre avatarUrl").sort({ createdAt: -1 });
}

export async function getRecetaById(id: string) {
  return Receta.findById(id).populate("autor", "nombre avatarUrl");
}

export async function createReceta(data: CrearRecetaDto, autorId: string) {
  const receta = new Receta({ ...data, autor: autorId });
  return receta.save();
}

export async function updateReceta(id: string, data: EditarRecetaDto, autorId: string) {
  return Receta.findOneAndUpdate(
    { _id: id, autor: autorId },
    data,
    { new: true }
  );
}

export async function deleteReceta(id: string, autorId: string) {
  return Receta.findOneAndDelete({ _id: id, autor: autorId });
}
