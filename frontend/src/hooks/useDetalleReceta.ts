import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRecetaById,
  getComentarios,
  crearComentario,
  eliminarComentario,
} from "../services/recetaService";
import type { ComentarioFormDTO } from "../types";

export function useDetalleReceta(id: string) {
  const queryClient = useQueryClient();

  const recetaQuery = useQuery({
    queryKey: ["receta", id],
    queryFn: () => getRecetaById(id),
    enabled: !!id,
  });

  const comentariosQuery = useQuery({
    queryKey: ["comentarios", id],
    queryFn: () => getComentarios(id),
    enabled: !!id,
  });

  const agregarComentario = useMutation({
    mutationFn: (data: ComentarioFormDTO) => crearComentario(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comentarios", id] });
    },
  });

  const borrarComentario = useMutation({
    mutationFn: (comentarioId: string) => eliminarComentario(comentarioId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comentarios", id] });
    },
  });

  return { recetaQuery, comentariosQuery, agregarComentario, borrarComentario };
}
