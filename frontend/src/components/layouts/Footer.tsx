import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export function Footer() {
  return (
    <footer className="foot-main">
      <div className="container foot-in">
        <Link to={ROUTES.INICIO} className="brand">
          Recipe<span>Hub</span>
        </Link>
        <div className="links">
          <Link to={ROUTES.INICIO}>Explorar</Link>
          <a href="#">Categorías</a>
          <a href="#">Cocineros</a>
          <a href="#">Acerca de</a>
        </div>
        <div className="copy">© {new Date().getFullYear()} RecipeHub · Cocina colaborativa</div>
      </div>
    </footer>
  );
}
