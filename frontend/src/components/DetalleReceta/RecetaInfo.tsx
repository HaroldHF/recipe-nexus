import type { Receta, Usuario } from "../../types";
import { ClockIcon, FlameIcon, UsersIcon } from "../shared/Icons";
import { Avatar } from "../shared/Avatar";

const GRADIENTS: Record<string, string> = {
  Desayuno: "linear-gradient(140deg, #fde9c8, #f9c279)",
  Almuerzo: "linear-gradient(140deg, #c8e6f5, #7ab8d9)",
  Cena:     "linear-gradient(140deg, #d4c5f9, #9b72d0)",
  Postre:   "linear-gradient(140deg, #ffd6e0, #ff8fa3)",
  Merienda: "linear-gradient(140deg, #c8f5e6, #5bbf9b)",
  General:  "linear-gradient(140deg, #e6b074, #c47c3c)",
};

interface RecetaInfoProps {
  receta: Receta;
  onEditar?: () => void;
  esAutor?: boolean;
}

export function RecetaInfo({ receta, onEditar, esAutor }: RecetaInfoProps) {
  const autor = receta.autor as Usuario;
  const gradiente = GRADIENTS[receta.categoria] ?? GRADIENTS["General"];

  return (
    <>
      {/* Hero image */}
      <div className="d-hero">
        <div className="ph-img" style={receta.imagenUrl ? undefined : { background: gradiente }}>
          {receta.imagenUrl ? (
            <img src={receta.imagenUrl} alt={receta.titulo} />
          ) : (
            <span className="ph-cap">{receta.titulo}</span>
          )}
        </div>
      </div>

      {/* Head */}
      <div className="d-head">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div className="d-eyebrow">{receta.categoria}</div>
            <h1 className="d-title">{receta.titulo}</h1>
          </div>
          {esAutor && (
            <div style={{ display: "flex", gap: 10, flexShrink: 0, marginTop: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={onEditar}>
                Editar
              </button>
            </div>
          )}
        </div>
        <p className="d-lede">{receta.descripcion}</p>
      </div>

      {/* Stats */}
      <div className="d-stats">
        {receta.tiempoPrep && (
          <div className="d-stat">
            <span className="ic"><ClockIcon size={18} /></span>
            <span>
              <span className="k">Tiempo</span>
              <div className="v">{receta.tiempoPrep} min</div>
            </span>
          </div>
        )}
        <div className="d-stat">
          <span className="ic"><FlameIcon size={18} /></span>
          <span>
            <span className="k">Pasos</span>
            <div className="v">{receta.pasos.length}</div>
          </span>
        </div>
        <div className="d-stat">
          <span className="ic"><UsersIcon size={18} /></span>
          <span>
            <span className="k">Ingredientes</span>
            <div className="v">{receta.ingredientes.length}</div>
          </span>
        </div>
      </div>

      {/* Author */}
      {autor && typeof autor === "object" && (
        <div className="author-card" style={{ marginTop: 12 }}>
          <Avatar usuario={autor} size={54} />
          <div className="meta">
            <div className="nm">{autor.nombre}</div>
            <div className="bio">{autor.email}</div>
          </div>
        </div>
      )}
    </>
  );
}
