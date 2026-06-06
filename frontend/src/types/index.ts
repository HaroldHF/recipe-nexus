import { z } from "zod";
import { DIFICULTADES, CATEGORIAS } from "../constants/recetas";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "ID inválido (debe ser un ObjectId de MongoDB)");

// ---------------------------------------------------------------------------
// Ingrediente
// ---------------------------------------------------------------------------

export const IngredienteSchema = z.object({
  nombre: z.string().min(1, "El nombre del ingrediente es requerido"),

  cantidad: z
    .string()
    .min(1, "La cantidad es requerida")
    .trim()
    .regex(
      /^\d+(?:[\/.,]\d+)?$/,
      "Cantidad inválida. Usa números (ej. 2), decimales (ej. 1.5) o fracciones (ej. 1/2)",
    ),

  unidad: z.string().min(1, "La unidad es requerida"),
});

export type Ingrediente = z.infer<typeof IngredienteSchema>;

// ---------------------------------------------------------------------------
// Usuario
// ---------------------------------------------------------------------------

export const UsuarioSchema = z.object({
  _id: objectIdSchema,
  nombre: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  avatarUrl: z
    .string()
    .url("URL de avatar inválida")
    .optional()
    .or(z.literal("")),
});

export type Usuario = z.infer<typeof UsuarioSchema>;

// ---------------------------------------------------------------------------
// Enums compartidos
// ---------------------------------------------------------------------------

export const CategoriaEnum = z.enum(CATEGORIAS);
export const DificultadEnum = z.enum(DIFICULTADES);

// ---------------------------------------------------------------------------
// Receta (respuesta del servidor)
// ---------------------------------------------------------------------------

export const RecetaSchema = z.object({
  _id: objectIdSchema,
  titulo: z.string().min(1, "El título es requerido").trim(),
  descripcion: z.string().min(10, "La descripción es requerida"),
  categoria: CategoriaEnum,
  tiempoMin: z
    .number(
      "Las porciones no pueden contener letras y deben ser un número válido",
    )
    .int()
    .positive("El tiempo debe ser un número positivo"),
  porciones: z
    .number("El tiempo no puede contener letras y debe ser un número válido")
    .int()
    .positive("Las porciones deben ser un número positivo"),
  dificultad: DificultadEnum,
  ingredientes: z
    .array(IngredienteSchema)
    .min(1, "Se requiere al menos un ingrediente"),
  pasos: z.array(z.string().min(1)).min(1, "Se requiere al menos un paso"),
  tags: z.array(z.string()).optional().default([]),
  autorId: z.union([UsuarioSchema, objectIdSchema]),
  imagenUrl: z
    .string()
    .url("URL de imagen inválida")
    .optional()
    .or(z.literal("")),
  createdAt: z.string().datetime({ message: "Fecha de creación inválida" }),
  updatedAt: z
    .string()
    .datetime({ message: "Fecha de actualización inválida" }),
});

export type Receta = z.infer<typeof RecetaSchema>;

// ---------------------------------------------------------------------------
// Comentario
// ---------------------------------------------------------------------------

export const ComentarioSchema = z.object({
  _id: objectIdSchema,
  texto: z.string().min(1, "El texto del comentario es requerido").trim(),
  calificacion: z.number().int().min(1, "Mínimo 1").max(5, "Máximo 5"),
  usuarioId: z.union([UsuarioSchema, objectIdSchema]),
  recetaId: objectIdSchema,
  createdAt: z.string().datetime({ message: "Fecha inválida" }),
});

export type Comentario = z.infer<typeof ComentarioSchema>;

// ---------------------------------------------------------------------------
// Auth DTOs
// ---------------------------------------------------------------------------

export const LoginDTOSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});
export type LoginDTO = z.infer<typeof LoginDTOSchema>;

export const RegisterDTOSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").trim(),
  email: z.string().email("Email inválido").toLowerCase(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});
export type RegisterDTO = z.infer<typeof RegisterDTOSchema>;

// ---------------------------------------------------------------------------
// RecetaFormDTO — tipo INTERNO del formulario
//
// pasos es { value: string }[] para ser compatible con useFieldArray.
// Este tipo nunca sale del componente: se aplana antes de llamar a onSubmit.
// ---------------------------------------------------------------------------

export const RecetaFormDTOSchema = z.object({
  titulo: z.string().min(1, "El título es requerido").trim(),
  descripcion: z
    .string()
    .min(10, "La descripcion debe ser de almenos 10 caracteres"),
  categoria: CategoriaEnum.optional(),
  tiempoMin: z.coerce
    .number()
    .int()
    .positive("El tiempo debe ser positivo")
    .optional(),
  porciones: z.coerce
    .number()
    .int()
    .positive("Las porciones deben ser positivas")
    .optional(),
  dificultad: DificultadEnum.optional(),
  ingredientes: z
    .array(IngredienteSchema)
    .min(1, "Se requiere al menos un ingrediente"),
  tags: z.array(z.string()).optional(),
  imagenUrl: z
    .string()
    .url("URL de imagen inválida")
    .optional()
    .or(z.literal("")),
  pasos: z
    .array(
      z.object({ value: z.string().min(1, "El paso no puede estar vacío") }),
    )
    .min(1, "Se requiere al menos un paso"),
});

export type RecetaFormDTO = z.infer<typeof RecetaFormDTOSchema>;

// ---------------------------------------------------------------------------
// RecetaPayload — lo que el hook y el servidor reciben
//
// Igual que RecetaFormDTO pero con pasos: string[].
// El formulario convierte RecetaFormDTO → RecetaPayload en handleFormSubmit.
// ---------------------------------------------------------------------------

export const RecetaPayloadSchema = RecetaFormDTOSchema.extend({
  pasos: z
    .array(z.string().min(1, "El paso no puede estar vacío"))
    .min(1, "Se requiere al menos un paso"),
});

export type RecetaPayload = z.infer<typeof RecetaPayloadSchema>;

// ---------------------------------------------------------------------------
// ComentarioFormDTO
// ---------------------------------------------------------------------------

export const ComentarioFormDTOSchema = z.object({
  texto: z.string().min(1, "El texto del comentario es requerido").trim(),
  calificacion: z.number().int().min(1, "Mínimo 1").max(5, "Máximo 5"),
});
export type ComentarioFormDTO = z.infer<typeof ComentarioFormDTOSchema>;

// ---------------------------------------------------------------------------
// Utilidad de validación
// ---------------------------------------------------------------------------

export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { data: T; errors: null } | { data: null; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) return { data: result.data, errors: null };
  return { data: null, errors: result.error };
}
