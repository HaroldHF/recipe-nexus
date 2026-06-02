import { Schema, model, Types } from "mongoose";

const comentarioSchema = new Schema(
  {
    contenido: { type: String, required: true, trim: true },
    autor: { type: Types.ObjectId, ref: "Usuario", required: true },
    receta: { type: Types.ObjectId, ref: "Receta", required: true },
  },
  { timestamps: true }
);

export const Comentario = model("Comentario", comentarioSchema);
