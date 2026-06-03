import { createContext, useContext } from "react";
import type { Usuario } from "../types";

export interface AuthContextValue {
  usuario: Usuario | null;
  token: string | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export function useAuthContext() {
  return useContext(AuthContext);
}
