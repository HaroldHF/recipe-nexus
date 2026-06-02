import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/usuario.model.js";
import type { RegisterDto, LoginDto } from "../validators/auth.validator.js";

export async function register(data: RegisterDto) {
  const existe = await Usuario.findOne({ email: data.email });
  if (existe) throw new Error("El email ya está registrado");

  const hash = await bcrypt.hash(data.password, 10);
  const usuario = await Usuario.create({ ...data, password: hash });

  return usuario;
}

export async function login(data: LoginDto) {
  const usuario = await Usuario.findOne({ email: data.email });
  if (!usuario) throw new Error("Credenciales inválidas");

  const coincide = await bcrypt.compare(data.password, usuario.password as string);
  if (!coincide) throw new Error("Credenciales inválidas");

  const secret = process.env.JWT_SECRET ?? "";
  const token = jwt.sign({ id: usuario._id }, secret, { expiresIn: "7d" });

  return { token, usuario };
}
