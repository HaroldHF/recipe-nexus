import { useQuery } from "@tanstack/react-query";
import { getRecetas } from "../services/recetaService";

export function useInicio() {
  return useQuery({
    queryKey: ["recetas"],
    queryFn: getRecetas,
  });
}
