import { createContext, useContext, useState } from "react";
import type { Usuario } from "../types";

interface AuthContextValue {
  usuario: Usuario | null;
  token: string | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const u = localStorage.getItem("usuario");
    return u ? (JSON.parse(u) as Usuario) : null;
  });

  function login(t: string, u: Usuario) {
    localStorage.setItem("token", t);
    localStorage.setItem("usuario", JSON.stringify(u));
    setToken(t);
    setUsuario(u);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
