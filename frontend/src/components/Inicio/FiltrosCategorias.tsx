const CATS = ["Todas", "Desayuno", "Almuerzo", "Cena", "Postre"];
const DIFFS = ["Todas", "Fácil", "Media", "Difícil"];

interface FiltrosCategoriasProps {
  activa: string;
  onChange: (cat: string) => void;
  totalRecetas: number;
}

export function FiltrosCategorias({ activa, onChange, totalRecetas }: FiltrosCategoriasProps) {
  return (
    <div className="filters">
      {CATS.map((c) => (
        <button
          key={c}
          className={"cat " + (activa === c ? "on" : "")}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
      <span className="fsep" />
      <select className="diff-sel">
        {DIFFS.map((d) => (
          <option key={d} value={d}>
            {d === "Todas" ? "Cualquier dificultad" : d}
          </option>
        ))}
      </select>
      <span className="results-info">
        {totalRecetas} receta{totalRecetas !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
