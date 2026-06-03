import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecetasByAutor } from "../services/perfilService";
import { eliminarReceta } from "../services/recetaService";
import { useAuthContext } from "../context/AuthContext";

export function usePerfil() {
  const { usuario } = useAuthContext();
  const queryClient = useQueryClient();

  const recetasQuery = useQuery({
    queryKey: ["recetas-perfil", usuario?._id],
    queryFn: () => getRecetasByAutor(usuario!._id),
    enabled: !!usuario,
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: string) => eliminarReceta(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recetas-perfil", usuario?._id] });
      void queryClient.invalidateQueries({ queryKey: ["recetas"] });
    },
  });

  return { recetasQuery, eliminarMutation, usuario };
}
