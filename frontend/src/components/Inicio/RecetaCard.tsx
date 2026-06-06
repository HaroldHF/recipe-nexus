import { Link } from "react-router-dom";
import type { Receta, Usuario } from "../../types";
import { buildRoute } from "../../constants/routes";
import { ClockIcon, StarIcon } from "../shared/Icons";

const GRADIENTS: Record<string, string> = {
  Desayuno: "linear-gradient(140deg, #fde9c8, #f9c279)",
  Almuerzo: "linear-gradient(140deg, #c8e6f5, #7ab8d9)",
  Cena:     "linear-gradient(140deg, #d4c5f9, #9b72d0)",
  Postre:   "linear-gradient(140deg, #ffd6e0, #ff8fa3)",
  Merienda: "linear-gradient(140deg, #c8f5e6, #5bbf9b)",
  General:  "linear-gradient(140deg, #e6b074, #c47c3c)",
};

function getGradient(categoria: string) {
  return GRADIENTS[categoria] ?? GRADIENTS["General"];
}

interface StarRowProps { rate: number }
function StarRow({ rate }: StarRowProps) {
  const n = Math.round(rate);
  return (
    <span className="star-row">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} size={15} className={i <= n ? "text-gold" : ""} />
      ))}
    </span>
  );
}

interface RecetaCardProps {
  receta: Receta;
}

export function RecetaCard({ receta }: RecetaCardProps) {
  const autor = receta.autorId as Usuario;

  return (
    <Link to={buildRoute.detalle(receta._id)} className="r-card fade-in">
      <div className="img-wrap">
        <div className="ph-img" style={receta.imagenUrl ? undefined : { background: getGradient(receta.categoria) }}>
          {receta.imagenUrl ? (
            <img src={receta.imagenUrl} alt={receta.titulo} />
          ) : (
            <span className="ph-cap">{receta.titulo}</span>
          )}
          <span className="badge">{receta.categoria}</span>
        </div>
      </div>
      <div className="cat-tag">{receta.categoria}</div>
      <h3>{receta.titulo}</h3>
      <div className="meta">
        {receta.tiempoMin && (
          <>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <ClockIcon size={14} /> {receta.tiempoMin} min
            </span>
            <span className="dot" />
          </>
        )}
        <span>{receta.ingredientes.length} ingredientes</span>
      </div>
      <div className="foot">
        <span className="rate">
          <StarRow rate={4} /> 4.0
        </span>
        <span className="author">por {autor?.nombre?.split(" ")[0] ?? "—"}</span>
      </div>
    </Link>
  );
}
