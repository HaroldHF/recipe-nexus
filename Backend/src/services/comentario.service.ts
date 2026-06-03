import { Comentario } from "../models/comentario.model.js";

export async function getComentariosByReceta(recetaId: string) {
  return Comentario.find({ receta: recetaId })
    .populate("autor", "nombre avatarUrl")
    .sort({ createdAt: -1 });
}

export async function createComentario(
  contenido: string,
  autorId: string,
  recetaId: string
) {
  return Comentario.create({ contenido, autor: autorId, receta: recetaId });
}

export async function deleteComentario(id: string, autorId: string) {
  return Comentario.findOneAndDelete({ _id: id, autor: autorId });
}
