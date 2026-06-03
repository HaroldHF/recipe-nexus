import { z } from "zod";

export const crearComentarioSchema = z.object({
  texto: z.string().min(1, "El texto del comentario es requerido"),
  calificacion: z
    .number()
    .int("La calificación debe ser un entero")
    .min(1, "La calificación mínima es 1")
    .max(5, "La calificación máxima es 5"),
});

export type CrearComentarioDto = z.infer<typeof crearComentarioSchema>;
