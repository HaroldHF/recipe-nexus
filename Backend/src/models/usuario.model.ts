import { Schema, model } from "mongoose";

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Usuario = model("Usuario", usuarioSchema);
