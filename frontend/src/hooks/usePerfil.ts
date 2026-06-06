import { useQuery, useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import { getRecetasByAutor } from "../services/perfilService";
import { eliminarReceta, getComentarios } from "../services/recetaService";
import { updatePerfil as updatePerfilService } from "../services/authService";
import { useAuthContext } from "../context/AuthContext";
import type { UpdatePerfilDTO } from "../types";

export function usePerfil() {
  const { usuario, token, login: updateAuthContext } = useAuthContext();
  const queryClient = useQueryClient();

  const recetasQuery = useQuery({
    queryKey: ["recetas-perfil", usuario?._id],
    queryFn: () => getRecetasByAutor(usuario!._id),
    enabled: !!usuario,
  });

  const recetas = recetasQuery.data ?? [];

  // Obtener comentarios para cada receta en paralelo utilizando useQueries
  const comentariosQueries = useQueries({
    queries: recetas.map((r) => ({
      queryKey: ["comentarios", r._id],
      queryFn: () => getComentarios(r._id),
      enabled: recetas.length > 0,
    })),
  });

  // Consolidar todos los comentarios de las recetas del usuario
  const todosComentarios = comentariosQueries.flatMap((q) => q.data ?? []);
  
  // Calcular la valoración media
  const valoracionMedia =
    todosComentarios.length > 0
      ? todosComentarios.reduce((acc, c) => acc + c.calificacion, 0) / todosComentarios.length
      : 0;

  const eliminarMutation = useMutation({
    mutationFn: (id: string) => eliminarReceta(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recetas-perfil", usuario?._id] });
      void queryClient.invalidateQueries({ queryKey: ["recetas"] });
    },
  });

  const editarPerfilMutation = useMutation({
    mutationFn: (data: UpdatePerfilDTO) => updatePerfilService(data),
    onSuccess: (res) => {
      // Actualizar el contexto de autenticación para propagar los cambios
      updateAuthContext(token!, res.usuario);
      void queryClient.invalidateQueries({ queryKey: ["recetas-perfil", usuario?._id] });
    },
  });

  return { 
    recetasQuery, 
    eliminarMutation, 
    editarPerfilMutation, 
    usuario, 
    valoracionMedia 
  };
}
