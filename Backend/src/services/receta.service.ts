import { Receta } from "../models/receta.model.js";
import type { CrearRecetaDto, EditarRecetaDto } from "../validators/receta.validator.js";

export async function getAllRecetas() {
  return Receta.find().populate("autor", "nombre avatar").sort({ createdAt: -1 });
}

export async function getRecetaById(id: string) {
  return Receta.findById(id).populate("autor", "nombre avatar");
}

export async function createReceta(data: CrearRecetaDto, autorId: string) {
  return Receta.create({ ...data, autor: autorId });
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
