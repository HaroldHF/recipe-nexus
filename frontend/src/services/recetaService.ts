import api from "../api/axiosConfig";
import type { Receta, RecetaFormDTO, Comentario, ComentarioFormDTO } from "../types";

export async function getRecetas(): Promise<Receta[]> {
  const res = await api.get<Receta[]>("/recetas");
  return res.data;
}

export async function getRecetaById(id: string): Promise<Receta> {
  const res = await api.get<Receta>(`/recetas/${id}`);
  return res.data;
}

export async function crearReceta(data: RecetaFormDTO): Promise<Receta> {
  const res = await api.post<Receta>("/recetas", data);
  return res.data;
}

export async function editarReceta(id: string, data: RecetaFormDTO): Promise<Receta> {
  const res = await api.put<Receta>(`/recetas/${id}`, data);
  return res.data;
}

export async function eliminarReceta(id: string): Promise<void> {
  await api.delete(`/recetas/${id}`);
}

export async function getComentarios(recetaId: string): Promise<Comentario[]> {
  const res = await api.get<Comentario[]>(`/recetas/${recetaId}/comentarios`);
  return res.data;
}

export async function crearComentario(recetaId: string, data: ComentarioFormDTO): Promise<Comentario> {
  const res = await api.post<Comentario>(`/recetas/${recetaId}/comentarios`, data);
  return res.data;
}

export async function eliminarComentario(id: string): Promise<void> {
  await api.delete(`/comentarios/${id}`);
}
