import type { Paso } from "../../types";

interface PasosListaProps {
  pasos: Paso[];
}

export function PasosLista({ pasos }: PasosListaProps) {
  const sorted = [...pasos].sort((a, b) => a.orden - b.orden);

  return (
    <>
      <h2 className="section-h">Preparación</h2>
      <ol className="steps">
        {sorted.map((paso, i) => (
          <li key={paso.orden}>
            <span className="step-n">{i + 1}</span>
            <span className="step-tx">{paso.descripcion}</span>
          </li>
        ))}
      </ol>
    </>
  );
}
