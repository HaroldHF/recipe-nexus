import { Schema, model, Types } from "mongoose";

// Subdocumento embebido: ingrediente
const ingredienteSchema = new Schema(
  {
    nombre: { type: String, required: true },
    cantidad: { type: String, required: true },
    unidad: { type: String, required: true },
  },
  { _id: false }
);

const recetaSchema = new Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    tiempoMin: { type: Number, required: true },
    porciones: { type: Number, required: true },
    dificultad: {
      type: String,
      required: true,
      enum: ["Fácil", "Media", "Difícil"],
    },
    ingredientes: { type: [ingredienteSchema], required: true }, // EMBEBIDO
    pasos: { type: [String], required: true },
    tags: { type: [String], default: [] },
    autorId: { type: Types.ObjectId, ref: "Usuario", required: true },
    imagenUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Receta = model("Receta", recetaSchema);
