import api from "../api/axiosConfig";
import type { LoginDTO, RegisterDTO, Usuario, UpdatePerfilDTO } from "../types";

export async function login(data: LoginDTO): Promise<{ token: string; usuario: Usuario }> {
  const res = await api.post<{ token: string; usuario: Usuario }>("/auth/login", data);
  return res.data;
}

export async function register(data: RegisterDTO): Promise<{ message: string; usuario: Usuario }> {
  const res = await api.post<{ message: string; usuario: Usuario }>("/auth/register", data);
  return res.data;
}

export async function updatePerfil(data: UpdatePerfilDTO): Promise<{ usuario: Usuario }> {
  const res = await api.put<{ usuario: Usuario }>("/auth/me", data);
  return res.data;
}
