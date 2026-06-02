import { z } from "zod";

export const crearRecetaSchema = z.object({
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  descripcion: z.string().min(10, "La descripción es muy corta"),
  ingredientes: z.array(z.string()).min(1, "Agrega al menos un ingrediente"),
  pasos: z.array(z.string()).min(1, "Agrega al menos un paso"),
  imagen: z.string().url("URL de imagen inválida").optional(),
  tiempoMinutos: z.number().int().positive().optional(),
  porciones: z.number().int().positive().optional(),
});

export const editarRecetaSchema = crearRecetaSchema.partial();

export type CrearRecetaDto = z.infer<typeof crearRecetaSchema>;
export type EditarRecetaDto = z.infer<typeof editarRecetaSchema>;
