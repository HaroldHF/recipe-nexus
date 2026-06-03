import { useState } from "react";
import { Link } from "react-router-dom";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Comentario } from "../../types";
import { ROUTES } from "../../constants/routes";

interface ComentarioFormProps {
  recetaId: string;
  estaAutenticado: boolean;
  agregarComentario: UseMutationResult<Comentario, Error, string>;
}

export function ComentarioForm({ estaAutenticado, agregarComentario }: ComentarioFormProps) {
  const [contenido, setContenido] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contenido.trim()) return;
    agregarComentario.mutate(contenido.trim(), {
      onSuccess: () => setContenido(""),
    });
  }

  if (!estaAutenticado) {
    return (
      <div className="c-login-prompt">
        <p>Inicia sesión para valorar y comentar esta receta.</p>
        <Link to={ROUTES.LOGIN} className="btn btn-primary">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form className="c-form" onSubmit={handleSubmit}>
      <div className="ttl">Deja tu comentario</div>
      <textarea
        className="textarea"
        style={{ marginTop: 14 }}
        placeholder="Cuenta cómo te quedó, tus trucos o variaciones…"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={agregarComentario.isPending || !contenido.trim()}
          style={{ opacity: !contenido.trim() ? 0.5 : 1 }}
        >
          {agregarComentario.isPending ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span className="spinner" /> Publicando…
            </span>
          ) : (
            "Publicar comentario"
          )}
        </button>
      </div>
    </form>
  );
}
