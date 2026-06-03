import type { Receta, Usuario } from "../types";
import { getRecetas } from "./recetaService";

export async function getRecetasByAutor(autorId: string): Promise<Receta[]> {
  const todas = await getRecetas();
  return todas.filter((r) => {
    const autor = r.autor as Usuario;
    return autor._id === autorId;
  });
}
