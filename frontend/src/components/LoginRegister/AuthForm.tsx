import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import type { AxiosError } from "axios";

type Modo = "login" | "register";

interface AuthFormProps {
  modo: Modo;
}

export function AuthForm({ modo }: AuthFormProps) {
  const navigate = useNavigate();
  const { loginMutation, registerMutation } = useAuth();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isPending = loginMutation.isPending || registerMutation.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (modo === "login") {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: () => navigate(ROUTES.INICIO),
          onError: (err) => {
            const ax = err as AxiosError<{ message: string }>;
            setError(ax.response?.data?.message ?? "Credenciales incorrectas");
          },
        }
      );
    } else {
      registerMutation.mutate(
        { nombre, email, password },
        {
          onSuccess: () => navigate(ROUTES.LOGIN),
          onError: (err) => {
            const ax = err as AxiosError<{ message: string }>;
            setError(ax.response?.data?.message ?? "Error al registrarse");
          },
        }
      );
    }
  }

  return (
    <div className="auth-main">
      <form className="auth-card fade-in" onSubmit={handleSubmit}>
        <h1>{modo === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}</h1>
        <p className="sub">
          {modo === "login"
            ? "Entra para guardar, valorar y publicar recetas."
            : "Empieza a publicar y guardar recetas en minutos."}
        </p>

        {modo === "register" && (
          <div className="field">
            <label className="label">Nombre</label>
            <input
              className="input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              required
            />
          </div>
        )}

        <div className="field">
          <label className="label">Correo electrónico</label>
          <input
            className={"input" + (error ? " err" : "")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
          />
        </div>

        <div className="field">
          <label className="label">Contraseña</label>
          <input
            className={"input" + (error ? " err" : "")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={modo === "register" ? "Mínimo 6 caracteres" : "••••••••"}
            required
            minLength={6}
          />
        </div>

        {error && <div className="field-err" style={{ marginBottom: 14 }}>{error}</div>}

        <button
          type="submit"
          className="btn btn-primary btn-block btn-lg"
          disabled={isPending}
          style={{ opacity: isPending ? 0.8 : 1 }}
        >
          {isPending ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
              <span className="spinner" />
              {modo === "login" ? "Entrando…" : "Registrando…"}
            </span>
          ) : modo === "login" ? (
            "Iniciar sesión"
          ) : (
            "Crear cuenta"
          )}
        </button>

        <div className="auth-foot">
          {modo === "login" ? (
            <>¿No tienes cuenta? <Link to={ROUTES.REGISTER}>Crear cuenta</Link></>
          ) : (
            <>¿Ya tienes cuenta? <Link to={ROUTES.LOGIN}>Iniciar sesión</Link></>
          )}
        </div>
      </form>
    </div>
  );
}
