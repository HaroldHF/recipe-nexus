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

export async function updatePerfil(id: string, data: {
  nombre: string;
  email: string;
  avatarUrl?: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  const usuario = await Usuario.findById(id);
  if (!usuario) throw new Error("Usuario no encontrado");

  // Si cambia de email, validar que no esté en uso por otro usuario
  if (data.email !== usuario.email) {
    const existe = await Usuario.findOne({ email: data.email });
    if (existe) throw new Error("El email ya está registrado por otro usuario");
    usuario.email = data.email;
  }

  usuario.nombre = data.nombre;
  usuario.avatarUrl = data.avatarUrl ?? "";

  // Si se desea actualizar la contraseña
  if (data.newPassword) {
    if (!data.currentPassword) {
      throw new Error("Debe ingresar la contraseña actual para cambiarla");
    }
    const coincide = await bcrypt.compare(data.currentPassword, usuario.password as string);
    if (!coincide) {
      throw new Error("La contraseña actual es incorrecta");
    }
    usuario.password = await bcrypt.hash(data.newPassword, 10);
  }

  await usuario.save();
  return toPublicUsuario(usuario);
}
