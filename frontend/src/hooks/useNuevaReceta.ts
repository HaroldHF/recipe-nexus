import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearReceta } from "../services/recetaService";
import type { RecetaFormDTO } from "../types";

export function useNuevaReceta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RecetaFormDTO) => crearReceta(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recetas"] });
    },
  });
}
