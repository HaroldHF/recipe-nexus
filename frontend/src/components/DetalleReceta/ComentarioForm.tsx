import { useState } from "react";
import { Link } from "react-router-dom";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Comentario, ComentarioFormDTO } from "../../types";
import { ROUTES } from "../../constants/routes";
import { StarIcon } from "../shared/Icons";

interface ComentarioFormProps {
  recetaId: string;
  estaAutenticado: boolean;
  agregarComentario: UseMutationResult<Comentario, Error, ComentarioFormDTO>;
}

export function ComentarioForm({ estaAutenticado, agregarComentario }: ComentarioFormProps) {
  const [texto, setTexto] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [hover, setHover] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim() || calificacion < 1) return;
    agregarComentario.mutate(
      { texto: texto.trim(), calificacion },
      {
        onSuccess: () => {
          setTexto("");
          setCalificacion(0);
        },
      }
    );
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

  const puedeEnviar = !!texto.trim() && calificacion >= 1;

  return (
    <form className="c-form" onSubmit={handleSubmit}>
      <div className="ttl">Deja tu comentario</div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-soft)", marginRight: 4 }}>
          Tu calificación
        </span>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setCalificacion(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "inline-flex" }}
          >
            <StarIcon size={22} className={n <= (hover || calificacion) ? "text-gold" : ""} />
          </button>
        ))}
      </div>

      <textarea
        className="textarea"
        style={{ marginTop: 14 }}
        placeholder="Cuenta cómo te quedó, tus trucos o variaciones…"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={agregarComentario.isPending || !puedeEnviar}
          style={{ opacity: !puedeEnviar ? 0.5 : 1 }}
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
