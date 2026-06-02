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

// Subdocumento embebido: paso de preparación
const pasoSchema = new Schema(
  {
    orden: { type: Number, required: true },
    descripcion: { type: String, required: true },
  },
  { _id: false }
);

const recetaSchema = new Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    ingredientes: { type: [ingredienteSchema], required: true }, // EMBEBIDO
    pasos: { type: [pasoSchema], required: true }, // EMBEBIDO
    autor: { type: Types.ObjectId, ref: "Usuario", required: true },
    categoria: { type: String, default: "General" },
    tiempoPrep: { type: Number },
  },
  { timestamps: true }
);

export const Receta = model("Receta", recetaSchema);
