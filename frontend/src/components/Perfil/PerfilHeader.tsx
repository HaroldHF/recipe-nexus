import { Link } from "react-router-dom";
import type { Usuario } from "../../types";
import { ROUTES } from "../../constants/routes";
import { PlusIcon, EditIcon } from "../shared/Icons";
import { Avatar } from "../shared/Avatar";

interface PerfilHeaderProps {
  usuario: Usuario;
  totalRecetas: number;
}

export function PerfilHeader({ usuario, totalRecetas }: PerfilHeaderProps) {
  return (
    <>
      {/* Full-bleed cover */}
      <div className="p-cover">
        <div className="blob" style={{ width: 200, height: 200, right: 60, top: -60 }} />
        <div className="blob" style={{ width: 130, height: 130, right: 280, bottom: -70 }} />
      </div>

      <div className="container">
        <div className="p-head">
          <Avatar usuario={usuario} size={124} />
          <div className="p-info">
            <div className="nm">{usuario.nombre}</div>
            <div className="handle">@{usuario.email.split("@")[0]}</div>
          </div>
          <Link to={ROUTES.NUEVA_RECETA} className="btn btn-ghost">
            <PlusIcon size={16} /> Nueva receta
          </Link>
          <button className="btn btn-ghost btn-icon" title="Editar perfil">
            <EditIcon size={17} />
          </button>
        </div>

        <div className="p-stats">
          <div className="p-stat">
            <div className="v">{totalRecetas}</div>
            <div className="k">Recetas</div>
          </div>
          <div className="p-stat">
            <div className="v">—</div>
            <div className="k">Seguidores</div>
          </div>
          <div className="p-stat">
            <div className="v">4.8</div>
            <div className="k">Valoración media</div>
          </div>
        </div>
      </div>
    </>
  );
}
