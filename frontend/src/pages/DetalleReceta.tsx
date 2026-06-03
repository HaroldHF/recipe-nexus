import { useParams, Link, useNavigate } from "react-router-dom";
import { useDetalleReceta } from "../hooks/useDetalleReceta";
import { useAuthContext } from "../context/AuthContext";
import { RecetaInfo } from "../components/DetalleReceta/RecetaInfo";
import { IngredientesCard } from "../components/DetalleReceta/IngredientesCard";
import { PasosLista } from "../components/DetalleReceta/PasosLista";
import { ComentarioForm } from "../components/DetalleReceta/ComentarioForm";
import { ComentariosList } from "../components/DetalleReceta/ComentariosList";
import { PageLoader } from "../components/PageLoader";
import { BackIcon } from "../components/shared/Icons";
import { buildRoute, ROUTES } from "../constants/routes";
import type { Usuario } from "../types";

export function DetalleReceta() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, usuario } = useAuthContext();
  const { recetaQuery, comentariosQuery, agregarComentario, borrarComentario } =
    useDetalleReceta(id ?? "");

  if (recetaQuery.isLoading) return <PageLoader />;

  if (recetaQuery.isError || !recetaQuery.data) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <div className="empty">
          <div className="serif">Receta no encontrada</div>
          <p>Puede que se haya movido o eliminado.</p>
          <Link to={ROUTES.INICIO} className="btn btn-primary" style={{ marginTop: 10 }}>
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const receta = recetaQuery.data;
  const autorObj = receta.autorId as Usuario;
  const esAutor = !!usuario && autorObj?._id === usuario._id;

  return (
    <div className="container detail fade-in">
      {/* Breadcrumb */}
      <div className="crumb">
        <Link
          to={ROUTES.INICIO}
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <BackIcon size={15} /> Inicio
        </Link>
        <span>/</span>
        <span style={{ color: "var(--ink-soft)" }}>{receta.categoria}</span>
      </div>

      {/* Hero + info */}
      <RecetaInfo
        receta={receta}
        esAutor={esAutor}
        onEditar={() => navigate(buildRoute.editar(receta._id))}
      />

      {/* Two-column grid */}
      <div className="d-grid">
        {/* Left: ingredients sticky */}
        <IngredientesCard ingredientes={receta.ingredientes} />

        {/* Right: steps + comments */}
        <main>
          <PasosLista pasos={receta.pasos} />

          <h2 className="section-h" style={{ marginTop: 44 }}>
            Comentarios · {comentariosQuery.data?.length ?? 0}
          </h2>

          <ComentarioForm
            recetaId={id ?? ""}
            estaAutenticado={!!token}
            agregarComentario={agregarComentario}
          />

          {comentariosQuery.isLoading ? (
            <PageLoader />
          ) : (
            <ComentariosList
              comentarios={comentariosQuery.data ?? []}
              usuarioActualId={usuario?._id}
              onEliminar={(cId) => borrarComentario.mutate(cId)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
