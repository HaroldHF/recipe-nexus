import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearReceta } from "../services/recetaService";
import type { RecetaPayload, Receta } from "../types/index";

type MutationContext = { previous: Receta[] | undefined };

export function useNuevaReceta() {
  const queryClient = useQueryClient();

  return useMutation<Receta, Error, RecetaPayload, MutationContext>({
    mutationFn: crearReceta,

    onMutate: async (nuevaReceta): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: ["recetas"] });
      const previous = queryClient.getQueryData<Receta[]>(["recetas"]);

      queryClient.setQueryData<Receta[]>(["recetas"], (old = []) => [
        {
          ...nuevaReceta,
          _id: `temp-${Date.now()}`,
          autorId: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          categoria: nuevaReceta.categoria ?? "General",
          dificultad: nuevaReceta.dificultad ?? "Fácil",
          tiempoMin: nuevaReceta.tiempoMin ?? 0,
          porciones: nuevaReceta.porciones ?? 0,
          pasos: nuevaReceta.pasos, // string[] ✓
          tags: nuevaReceta.tags ?? [],
          imagenUrl: nuevaReceta.imagenUrl ?? "",
        } satisfies Receta,
        ...old,
      ]);

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(["recetas"], context.previous);
      }
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["recetas"] });
    },
  });
}
