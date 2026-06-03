import { z } from "zod";

const ingredienteSchema = z.object({
  nombre: z.string().min(1, "El nombre del ingrediente es requerido"),
  cantidad: z.string().min(1, "La cantidad es requerida"),
  unidad: z.string().min(1, "La unidad es requerida"),
});

export const crearRecetaSchema = z.object({
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  descripcion: z.string().min(10, "La descripción es muy corta"),
  categoria: z.string().min(1, "La categoría es requerida"),
  tiempoMin: z.number().int().positive("El tiempo debe ser un entero positivo"),
  porciones: z.number().int().positive("Las porciones deben ser un entero positivo"),
  dificultad: z.enum(["Fácil", "Media", "Difícil"]),
  ingredientes: z.array(ingredienteSchema).min(1, "Agrega al menos un ingrediente"),
  pasos: z.array(z.string().min(1, "El paso no puede estar vacío")).min(1, "Agrega al menos un paso"),
  tags: z.array(z.string()).optional(),
  imagenUrl: z.string().url().optional(),
});

export const editarRecetaSchema = crearRecetaSchema.partial();

export type CrearRecetaDto = z.infer<typeof crearRecetaSchema>;
export type EditarRecetaDto = z.infer<typeof editarRecetaSchema>;
