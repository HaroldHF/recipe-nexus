import { useRef, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { ROUTES } from "../../constants/routes";
import { SearchIcon, PlusIcon, UserIcon, LogoutIcon } from "../shared/Icons";
import { Avatar } from "../shared/Avatar";

function MenuIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function Navbar() {
  const { usuario, logout } = useAuthContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <header className="nav relative">
      <div className="container nav-in">
        <Link to={ROUTES.INICIO} className="brand">
          Recipe<span>Hub</span>
        </Link>

        <nav className="nav-links hidden md:flex">
          <NavLink to={ROUTES.INICIO} end className={({ isActive }) => (isActive ? "active" : "")}>
            Inicio
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

        <div className="nav-search hidden md:flex">
          <SearchIcon size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar recetas…"
          />
        </div>

        {/* Acciones de usuario en escritorio */}
        <div className="hidden md:flex items-center">
          {usuario ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button className="btn btn-primary btn-sm" onClick={() => navigate(ROUTES.NUEVA_RECETA)}>
                <PlusIcon size={15} /> Crear
              </button>
              <div style={{ position: "relative" }} ref={menuRef}>
                <button className="av-btn" onClick={() => setMenuOpen((o) => !o)}>
                  <Avatar usuario={usuario} size={38} />
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

        {/* Botón para menú móvil en pantallas pequeñas */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-xl text-ink hover:bg-cream-2 border border-line-2 transition-colors cursor-pointer"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label="Menú principal"
        >
          {mobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 bg-cream-2/95 backdrop-blur-md border-b border-line shadow-lg fade-in z-40 p-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <NavLink
              to={ROUTES.INICIO}
              end
              className={({ isActive }) =>
                `text-base font-bold p-3 rounded-xl transition-colors ${
                  isActive ? "text-orange-d bg-orange-soft" : "text-ink hover:bg-cream"
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </NavLink>
            {usuario && (
              <NavLink
                to={ROUTES.NUEVA_RECETA}
                className={({ isActive }) =>
                  `text-base font-bold p-3 rounded-xl transition-colors ${
                    isActive ? "text-orange-d bg-orange-soft" : "text-ink hover:bg-cream"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Nueva receta
              </NavLink>
            )}
          </div>

          <div className="flex items-center gap-2 border border-line-2 rounded-full px-4 py-2.5 bg-paper w-full">
            <SearchIcon size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar recetas…"
              className="bg-transparent border-none outline-none w-full text-sm text-ink placeholder-muted"
            />
          </div>

          <div className="border-t border-line-2 pt-4">
            {usuario ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 bg-paper p-3 rounded-xl border border-line">
                  <Avatar usuario={usuario} size={42} />
                  <div>
                    <div className="font-bold text-sm text-ink">{usuario.nombre}</div>
                    <div className="text-xs text-muted">{usuario.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="btn btn-ghost btn-sm py-2.5 justify-center font-bold"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(ROUTES.PERFIL);
                    }}
                  >
                    <UserIcon size={15} /> Perfil
                  </button>
                  <button
                    className="btn btn-primary btn-sm py-2.5 justify-center font-bold"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(ROUTES.NUEVA_RECETA);
                    }}
                  >
                    <PlusIcon size={15} /> Crear
                  </button>
                </div>
                <button
                  className="btn btn-danger btn-block py-2.5 justify-center border border-berry/20 rounded-xl font-bold"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogoutIcon size={15} /> Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link
                  to={ROUTES.LOGIN}
                  className="btn btn-ghost btn-block py-3 text-center rounded-xl font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="btn btn-primary btn-block py-3 text-center rounded-xl font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Crear cuenta
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
