interface PasosListaProps {
  pasos: string[];
}

export function PasosLista({ pasos }: PasosListaProps) {
  return (
    <>
      <h2 className="section-h">Preparación</h2>
      <ol className="steps">
        {pasos.map((paso, i) => (
          <li key={i}>
            <span className="step-n">{i + 1}</span>
            <span className="step-tx">{paso}</span>
          </li>
        ))}
      </ol>
    </>
  );
}
