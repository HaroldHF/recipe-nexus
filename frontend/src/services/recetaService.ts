import api from "../api/axiosConfig";
import type {
  Receta,
  RecetaPayload,
  Comentario,
  ComentarioFormDTO,
} from "../types";

export async function getRecetas(): Promise<Receta[]> {
  const res = await api.get<Receta[] | { recetas?: Receta[]; data?: Receta[] }>(
    "/recetas",
  );
  const payload = res.data;

  // La API puede responder un array plano `[...]` o un objeto envoltorio
  // tipo `{ recetas: [...] }`. Normalizamos siempre a un array para que el
  // Home pueda hacer .map()/.filter() sin romperse ("a.map is not a function").
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.recetas)) return payload.recetas;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export async function getRecetaById(id: string): Promise<Receta> {
  const res = await api.get<Receta>(`/recetas/${id}`);
  return res.data;
}

export async function crearReceta(data: RecetaPayload): Promise<Receta> {
  const res = await api.post<Receta>("/recetas", data);
  return res.data;
}

export async function editarReceta(
  id: string,
  data: RecetaPayload,
): Promise<Receta> {
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

export async function crearComentario(
  recetaId: string,
  data: ComentarioFormDTO,
): Promise<Comentario> {
  const res = await api.post<Comentario>(
    `/recetas/${recetaId}/comentarios`,
    data,
  );
  return res.data;
}

export async function eliminarComentario(id: string): Promise<void> {
  await api.delete(`/comentarios/${id}`);
}
