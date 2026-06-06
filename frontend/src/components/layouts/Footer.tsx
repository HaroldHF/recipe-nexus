import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export function Footer() {
  return (
    <footer className="foot-main">
      <div className="container foot-in flex flex-col md:flex-row items-center md:justify-between text-center md:text-left gap-6 md:gap-4">
        <Link to={ROUTES.INICIO} className="brand">
          Recipe<span>Hub</span>
        </Link>
        <div className="links flex-wrap justify-center">
          <Link to={ROUTES.INICIO}>Inicio</Link>
          <a href="#">Categorías</a>
          <a href="#">Cocineros</a>
          <a href="#">Acerca de</a>
        </div>
        <div className="copy">© {new Date().getFullYear()} RecipeHub · Cocina colaborativa</div>
      </div>
    </footer>
  );
}
