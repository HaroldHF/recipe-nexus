import { Schema, model, Types } from "mongoose";

const recetaSchema = new Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    ingredientes: [{ type: String, required: true }],
    pasos: [{ type: String, required: true }],
    imagen: { type: String, default: "" },
    autor: { type: Types.ObjectId, ref: "Usuario", required: true },
    tiempoMinutos: { type: Number, default: 0 },
    porciones: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Receta = model("Receta", recetaSchema);
