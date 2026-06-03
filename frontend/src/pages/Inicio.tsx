import { useState } from "react";
import { useInicio } from "../hooks/useInicio";
import { BannerHero } from "../components/Inicio/BannerHero";
import { FiltrosCategorias } from "../components/Inicio/FiltrosCategorias";
import { RecetaCard } from "../components/Inicio/RecetaCard";
import { PageLoader } from "../components/PageLoader";

export function Inicio() {
  const { data: recetas, isLoading, isError } = useInicio();
  const [categoria, setCategoria] = useState("Todas");

  const recetasFiltradas =
    categoria === "Todas"
      ? (recetas ?? [])
      : (recetas ?? []).filter(
          (r) => r.categoria.toLowerCase() === categoria.toLowerCase()
        );

  return (
    <div className="container home-wrap">
      <BannerHero />

      <FiltrosCategorias
        activa={categoria}
        onChange={setCategoria}
        totalRecetas={recetasFiltradas.length}
      />

      {isLoading ? (
        <PageLoader />
      ) : isError ? (
        <div className="empty">
          <div className="serif">Sin conexión al servidor</div>
          <p>Asegúrate de que el backend esté activo.</p>
        </div>
      ) : recetasFiltradas.length === 0 ? (
        <div className="empty">
          <div className="serif">Sin resultados</div>
          <p>Prueba con otra categoría o sé el primero en publicar.</p>
        </div>
      ) : (
        <div className="grid3">
          {recetasFiltradas.map((receta) => (
            <RecetaCard key={receta._id} receta={receta} />
          ))}
        </div>
      )}
    </div>
  );
}
