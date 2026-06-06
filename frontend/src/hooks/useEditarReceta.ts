import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecetaById, editarReceta } from "../services/recetaService";
import type { RecetaPayload } from "../types";

export function useEditarReceta(id: string) {
  const queryClient = useQueryClient();

  const recetaQuery = useQuery({
    queryKey: ["receta", id],
    queryFn: () => getRecetaById(id),
    enabled: !!id,
  });

  const editarMutation = useMutation({
    mutationFn: (data: RecetaPayload) => editarReceta(id, data),
    onSuccess: (recetaActualizada) => {
      queryClient.setQueryData(["receta", id], recetaActualizada);
      void queryClient.invalidateQueries({ queryKey: ["recetas"] });
    },
  });

  return { recetaQuery, editarMutation };
}
