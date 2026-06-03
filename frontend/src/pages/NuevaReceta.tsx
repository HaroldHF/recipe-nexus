import { useNavigate } from "react-router-dom";
import { useNuevaReceta } from "../hooks/useNuevaReceta";
import { FormNuevaReceta } from "../components/NuevaReceta/FormNuevaReceta";
import { buildRoute, ROUTES } from "../constants/routes";
import type { RecetaFormDTO } from "../types";

export function NuevaReceta() {
  const navigate = useNavigate();
  const mutation = useNuevaReceta();

  function handleSubmit(data: RecetaFormDTO) {
    mutation.mutate(data, {
      onSuccess: (receta) => navigate(buildRoute.detalle(receta._id)),
    });
  }

  return (
    <FormNuevaReceta
      isPending={mutation.isPending}
      submitLabel="Publicar receta"
      isEdit={false}
      onSubmit={handleSubmit}
      onCancel={() => navigate(ROUTES.INICIO)}
    />
  );
}
