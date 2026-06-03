import { Schema, model, Types } from "mongoose";

const comentarioSchema = new Schema(
  {
    recetaId: { type: Types.ObjectId, ref: "Receta", required: true },
    usuarioId: { type: Types.ObjectId, ref: "Usuario", required: true },
    texto: { type: String, required: true, trim: true },
    calificacion: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "La calificación debe ser un entero entre 1 y 5",
      },
    },
  },
  { timestamps: true }
);

export const Comentario = model("Comentario", comentarioSchema);
