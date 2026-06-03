import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/usuario.model.js";
import type { RegisterDto, LoginDto } from "../validators/auth.validator.js";

// Forma pública del usuario — nunca expone el hash de la contraseña.
function toPublicUsuario(usuario: InstanceType<typeof Usuario>) {
  return {
    _id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    avatarUrl: usuario.avatarUrl,
  };
}

export async function register(data: RegisterDto) {
  const existe = await Usuario.findOne({ email: data.email });
  if (existe) throw new Error("El email ya está registrado");

  const hash = await bcrypt.hash(data.password, 10);
  const usuario = await Usuario.create({ ...data, password: hash });

  return toPublicUsuario(usuario);
}

export async function getMe(id: string) {
  const usuario = await Usuario.findById(id);
  if (!usuario) return null;
  return toPublicUsuario(usuario);
}

export async function login(data: LoginDto) {
  const usuario = await Usuario.findOne({ email: data.email });
  if (!usuario) throw new Error("Credenciales inválidas");

  const coincide = await bcrypt.compare(data.password, usuario.password as string);
  if (!coincide) throw new Error("Credenciales inválidas");

  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign(
    { id: usuario._id.toString(), email: usuario.email },
    secret,
    { expiresIn: "7d" }
  );

  return { token, usuario: toPublicUsuario(usuario) };
}
