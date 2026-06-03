import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { StarIcon } from "../shared/Icons";

export function BannerHero() {
  return (
    <section className="banner fade-in">
      <div className="blob b1" />
      <div className="blob b2" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="eyebrow">El recetario de la comunidad</div>
        <h1>Cocina algo memorable esta noche.</h1>
        <p>
          Recetas caseras compartidas y puntuadas por personas que cocinan de verdad.
          Encuentra tu próxima favorita.
        </p>
        <Link to={ROUTES.REGISTER} className="pill" style={{ display: "inline-flex", marginTop: 24 }}>
          <StarIcon size={15} />
          Más de 1.200 cocineros activos
        </Link>
      </div>
    </section>
  );
}
