const CATS = ["Todas", "Desayuno", "Almuerzo", "Cena", "Postre"];
const DIFFS = ["Todas", "Fácil", "Media", "Difícil"];

interface FiltrosCategoriasProps {
  activa: string;
  onChange: (cat: string) => void;
  totalRecetas: number;
}

export function FiltrosCategorias({ activa, onChange, totalRecetas }: FiltrosCategoriasProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8 mb-6">
      {/* Lista de categorías deslizable horizontalmente en móvil */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide flex-nowrap border-b border-line md:border-none">
        {CATS.map((c) => (
          <button
            key={c}
            className={"cat flex-none " + (activa === c ? "on" : "")}
            onClick={() => onChange(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Selector de dificultad e info de resultados */}
      <div className="flex items-center justify-between md:justify-end gap-6">
        <select className="diff-sel">
          {DIFFS.map((d) => (
            <option key={d} value={d}>
              {d === "Todas" ? "Cualquier dificultad" : d}
            </option>
          ))}
        </select>
        <span className="results-info text-muted text-sm font-semibold whitespace-nowrap">
          {totalRecetas} receta{totalRecetas !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
