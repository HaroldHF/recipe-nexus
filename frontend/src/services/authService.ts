import api from "../api/axiosConfig";
import type { LoginDTO, RegisterDTO, Usuario } from "../types";

export async function login(data: LoginDTO): Promise<{ token: string; usuario: Usuario }> {
  const res = await api.post<{ token: string; usuario: Usuario }>("/auth/login", data);
  return res.data;
}

export async function register(data: RegisterDTO): Promise<{ message: string; usuario: Usuario }> {
  const res = await api.post<{ message: string; usuario: Usuario }>("/auth/register", data);
  return res.data;
}
