import { useState } from "react";
import type { Usuario } from "../types";
import { AuthContext } from "./authContextValue";

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
