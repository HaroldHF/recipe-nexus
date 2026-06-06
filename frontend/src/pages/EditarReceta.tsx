import { useNavigate, useParams } from "react-router-dom";
import { useEditarReceta } from "../hooks/useEditarReceta";
import { FormNuevaReceta } from "../components/NuevaReceta/FormNuevaReceta";
import { PageLoader } from "../components/PageLoader";
import { buildRoute, ROUTES } from "../constants/routes";
import type { RecetaPayload } from "../types";

export function EditarReceta() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recetaQuery, editarMutation } = useEditarReceta(id ?? "");

  if (recetaQuery.isLoading) return <PageLoader />;
  if (recetaQuery.isError || !recetaQuery.data) {
    return (
      <div
        className="container"
        style={{ padding: "80px 0", textAlign: "center" }}
      >
        <div className="empty">
          <div className="serif">Receta no encontrada</div>
        </div>
      </div>
    );
  }

  const receta = recetaQuery.data;

  function handleSubmit(data: RecetaPayload) {
    editarMutation.mutate(data, {
      onSuccess: () => navigate(buildRoute.detalle(id ?? "")),
    });
  }

  return (
    <FormNuevaReceta
      defaultValues={{
        titulo: receta.titulo,
        descripcion: receta.descripcion,
        categoria: receta.categoria,
        dificultad: receta.dificultad,
        tiempoMin: receta.tiempoMin,
        porciones: receta.porciones,
        tags: receta.tags,
        ingredientes: receta.ingredientes,
        pasos: receta.pasos,
      }}
      isPending={editarMutation.isPending}
      submitLabel="Guardar cambios"
      isEdit={true}
      onSubmit={handleSubmit}
      onCancel={() => navigate(ROUTES.PERFIL)}
    />
  );
}
