import { z } from "zod";

const ingredienteSchema = z.object({
  nombre: z.string().min(1, "El nombre del ingrediente es requerido"),
  cantidad: z.string().min(1, "La cantidad es requerida"),
  unidad: z.string().min(1, "La unidad es requerida"),
});

const pasoSchema = z.object({
  orden: z.number().int().positive("El orden debe ser un entero positivo"),
  descripcion: z.string().min(1, "La descripción del paso es requerida"),
});

export const crearRecetaSchema = z.object({
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  descripcion: z.string().min(10, "La descripción es muy corta"),
  ingredientes: z.array(ingredienteSchema).min(1, "Agrega al menos un ingrediente"),
  pasos: z.array(pasoSchema).min(1, "Agrega al menos un paso"),
  categoria: z.string().optional(),
  tiempoPrep: z.number().int().positive().optional(),
  imagenUrl: z.string().url().optional(),
});

export const editarRecetaSchema = crearRecetaSchema.partial();

export type CrearRecetaDto = z.infer<typeof crearRecetaSchema>;
export type EditarRecetaDto = z.infer<typeof editarRecetaSchema>;
