import { Comentario } from "../models/comentario.model.js";

export async function getComentariosByReceta(recetaId: string) {
  return Comentario.find({ recetaId })
    .populate("usuarioId", "nombre avatarUrl")
    .sort({ createdAt: -1 });
}

export async function createComentario(
  texto: string,
  calificacion: number,
  usuarioId: string,
  recetaId: string
) {
  return Comentario.create({ texto, calificacion, usuarioId, recetaId });
}

export async function deleteComentario(id: string, usuarioId: string) {
  return Comentario.findOneAndDelete({ _id: id, usuarioId });
}
