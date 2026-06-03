import { useState } from "react";
import type { Ingrediente } from "../../types";
import { CheckIcon } from "../shared/Icons";

interface IngredientesCardProps {
  ingredientes: Ingrediente[];
}

export function IngredientesCard({ ingredientes }: IngredientesCardProps) {
  const [marcados, setMarcados] = useState<boolean[]>(() =>
    ingredientes.map(() => false)
  );

  function toggle(i: number) {
    setMarcados((prev) => prev.map((v, j) => (j === i ? !v : v)));
  }

  return (
    <aside className="ing-card">
      <h3>Ingredientes</h3>
      <div className="sub">Para {ingredientes.length} ingredientes</div>
      <ul className="ing-list">
        {ingredientes.map((ing, i) => (
          <li key={i} className={marcados[i] ? "done" : ""}>
            <span
              className={"ing-check " + (marcados[i] ? "on" : "")}
              onClick={() => toggle(i)}
            >
              {marcados[i] && <CheckIcon size={13} />}
            </span>
            <span className="nm" style={{ flex: 1 }}>
              <span className="qty">{ing.cantidad} {ing.unidad}</span> {ing.nombre}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
