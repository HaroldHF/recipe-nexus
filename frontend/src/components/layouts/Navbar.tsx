import { useRef, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { ROUTES } from "../../constants/routes";
import { SearchIcon, PlusIcon, UserIcon, LogoutIcon } from "../shared/Icons";

export function Navbar() {
  const { usuario, logout } = useAuthContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate(ROUTES.INICIO);
  }

  const initials = usuario
    ? usuario.nombre.split(" ").map((w) => w[0]).slice(0, 2).join("")
    : "";

  return (
    <header className="nav">
      <div className="container nav-in">
        <Link to={ROUTES.INICIO} className="brand">
          Recipe<span>Hub</span>
        </Link>

        <nav className="nav-links">
          <NavLink to={ROUTES.INICIO} end className={({ isActive }) => (isActive ? "active" : "")}>
            Inicio
          </NavLink>
          <NavLink to={ROUTES.INICIO} className="">
            Explorar
          </NavLink>
          {usuario && (
            <NavLink
              to={ROUTES.NUEVA_RECETA}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Nueva receta
            </NavLink>
          )}
        </nav>

        <div className="nav-spacer" />

        <div className="nav-search">
          <SearchIcon size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar recetas…"
          />
        </div>

        {usuario ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button className="btn btn-primary btn-sm" onClick={() => navigate(ROUTES.NUEVA_RECETA)}>
              <PlusIcon size={15} /> Crear
            </button>
            <div style={{ position: "relative" }} ref={menuRef}>
              <button className="av-btn" onClick={() => setMenuOpen((o) => !o)}>
                <span className="avatar" style={{ width: 38, height: 38, fontSize: 15 }}>
                  {initials}
                </span>
              </button>
              {menuOpen && (
                <div className="menu">
                  <div className="mhead">
                    <div className="nm">{usuario.nombre}</div>
                    <div className="em">{usuario.email}</div>
                  </div>
                  <button onClick={() => { setMenuOpen(false); navigate(ROUTES.PERFIL); }}>
                    <UserIcon size={17} /> Mi perfil
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate(ROUTES.NUEVA_RECETA); }}>
                    <PlusIcon size={17} /> Nueva receta
                  </button>
                  <button className="danger" onClick={handleLogout}>
                    <LogoutIcon size={17} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link to={ROUTES.LOGIN} className="btn btn-ghost btn-sm">
              Iniciar sesión
            </Link>
            <Link to={ROUTES.REGISTER} className="btn btn-primary btn-sm">
              Crear cuenta
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
