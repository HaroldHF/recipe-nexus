import { useState } from "react";
import { Link } from "react-router-dom";
import { usePerfil } from "../hooks/usePerfil";
import { PerfilHeader } from "../components/Perfil/PerfilHeader";
import { RecetaCard } from "../components/Inicio/RecetaCard";
import { EditProfileModal } from "../components/Perfil/EditProfileModal";
import { PageLoader } from "../components/PageLoader";
import { buildRoute, ROUTES } from "../constants/routes";
import { EditIcon, TrashIcon } from "../components/shared/Icons";

export function Perfil() {
  const { 
    recetasQuery, 
    eliminarMutation, 
    editarPerfilMutation, 
    usuario, 
    valoracionMedia 
  } = usePerfil();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!usuario) return null;

  return (
    <div className="profile fade-in">
      <PerfilHeader
        usuario={usuario}
        totalRecetas={recetasQuery.data?.length ?? 0}
        valoracionMedia={valoracionMedia}
        onEditClick={() => setIsEditModalOpen(true)}
      />

      <div className="container">
        {recetasQuery.isLoading ? (
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
        )}
      </div>

      {/* Modal para editar perfil */}
      <EditProfileModal
        usuario={usuario}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={async (data) => {
          await editarPerfilMutation.mutateAsync(data);
        }}
        isPending={editarPerfilMutation.isPending}
      />
    </div>
  );
}
