import { useState } from "react";
import { Link } from "react-router-dom";
import { usePerfil } from "../hooks/usePerfil";
import { PerfilHeader } from "../components/Perfil/PerfilHeader";
import { RecetaCard } from "../components/Inicio/RecetaCard";
import { PageLoader } from "../components/PageLoader";
import { buildRoute, ROUTES } from "../constants/routes";
import { EditIcon, TrashIcon } from "../components/shared/Icons";

export function Perfil() {
  const { recetasQuery, eliminarMutation, usuario } = usePerfil();
  const [tab, setTab] = useState("recetas");

  if (!usuario) return null;

  return (
    <div className="profile fade-in">
      <PerfilHeader
        usuario={usuario}
        totalRecetas={recetasQuery.data?.length ?? 0}
      />

      <div className="container">
        <div className="p-tabs">
          <button
            className={"p-tab " + (tab === "recetas" ? "on" : "")}
            onClick={() => setTab("recetas")}
          >
            Recetas publicadas
          </button>
          <button
            className={"p-tab " + (tab === "guardadas" ? "on" : "")}
            onClick={() => setTab("guardadas")}
          >
            Guardadas
          </button>
        </div>

        {tab === "recetas" ? (
          recetasQuery.isLoading ? (
            <PageLoader />
          ) : (recetasQuery.data?.length ?? 0) === 0 ? (
            <div className="empty">
              <div className="serif">Aún no has publicado recetas</div>
              <p>Comparte tu primera receta con la comunidad.</p>
              <Link to={ROUTES.NUEVA_RECETA} className="btn btn-primary" style={{ marginTop: 10 }}>
                Crear receta
              </Link>
            </div>
          ) : (
            <div className="grid3" style={{ paddingBottom: 50 }}>
              {(recetasQuery.data ?? []).map((receta) => (
                <div key={receta._id} style={{ position: "relative" }} className="group">
                  <RecetaCard receta={receta} />
                  {/* Overlay actions */}
                  <div style={{
                    position: "absolute", top: 46, left: 12,
                    display: "flex", gap: 6, opacity: 0, transition: "opacity .15s"
                  }}
                    className="card-actions"
                  >
                    <Link
                      to={buildRoute.editar(receta._id)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "6px 10px" }}
                      title="Editar"
                    >
                      <EditIcon size={14} />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm("¿Eliminar esta receta?")) {
                          eliminarMutation.mutate(receta._id);
                        }
                      }}
                      className="btn btn-danger btn-sm"
                      style={{ padding: "6px 10px" }}
                      title="Eliminar"
                      disabled={eliminarMutation.isPending}
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="empty" style={{ paddingBottom: 60 }}>
            <div className="serif">Nada guardado todavía</div>
            <p>Pulsa el corazón en cualquier receta para guardarla aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
}
