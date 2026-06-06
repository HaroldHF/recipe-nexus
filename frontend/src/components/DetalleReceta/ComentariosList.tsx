import type { Comentario, Usuario } from "../../types";
import { TrashIcon, StarIcon } from "../shared/Icons";


interface ComentariosListProps {
  comentarios: Comentario[];
  usuarioActualId?: string;
  onEliminar: (id: string) => void;
}

export function ComentariosList({ comentarios, usuarioActualId, onEliminar }: ComentariosListProps) {
  if (comentarios.length === 0) {
    return (
      <p style={{ color: "var(--muted)", fontSize: 14, fontStyle: "italic" }}>
        Sé el primero en comentar esta receta.
      </p>
    );
  }

  return (
    <div className="comments">
      {comentarios.map((c) => {
        const autor = typeof c.usuarioId === "object" && c.usuarioId !== null ? (c.usuarioId as Usuario) : null;
        const esAutor = (autor ? autor._id : c.usuarioId) === usuarioActualId;
        const initials = autor?.nombre
          ? autor.nombre.split(" ").map((w: string) => w[0]).slice(0, 2).join("")
          : "?";

        return (
          <div className="c-item" key={c._id}>
            <span className="avatar" style={{ width: 44, height: 44, fontSize: 17, flexShrink: 0 }}>
              {initials}
            </span>
            <div className="body">
              <div className="top">
                <span className="nm">{autor?.nombre ?? "Anónimo"}</span>
                <span className="when">
                  · {new Date(c.createdAt).toLocaleDateString("es-CR", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                {esAutor && (
                  <button
                    onClick={() => onEliminar(c._id)}
                    className="btn-danger btn-icon"
                    style={{ marginLeft: "auto", padding: "4px 6px", borderRadius: 8 }}
                    title="Eliminar"
                  >
                    <TrashIcon size={14} />
                  </button>
                )}
              </div>
              <span className="star-row" style={{ display: "inline-flex", gap: 1, margin: "2px 0 4px" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarIcon key={n} size={14} className={n <= c.calificacion ? "text-gold" : ""} />
                ))}
              </span>
              <div className="tx">{c.texto}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
