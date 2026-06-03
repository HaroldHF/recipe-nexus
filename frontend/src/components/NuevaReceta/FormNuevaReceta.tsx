import { useState } from "react";
import type { RecetaFormDTO, Ingrediente, Paso } from "../../types";
import { PlusIcon, TrashIcon } from "../shared/Icons";

const CATS = ["Desayuno", "Almuerzo", "Cena", "Postre", "Merienda", "General"];
const DIFFS = ["Fácil", "Media", "Difícil"];
const UNITS = ["g", "kg", "ml", "l", "ud", "cda", "cdta", "taza", "diente", "pizca", "al gusto"];

interface FormRecetaProps {
  defaultValues?: Partial<RecetaFormDTO>;
  isPending: boolean;
  submitLabel: string;
  isEdit?: boolean;
  onSubmit: (data: RecetaFormDTO) => void;
  onCancel: () => void;
}

export function FormNuevaReceta({
  defaultValues,
  isPending,
  submitLabel,
  isEdit = false,
  onSubmit,
  onCancel,
}: FormRecetaProps) {
  const [titulo, setTitulo] = useState(defaultValues?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(defaultValues?.descripcion ?? "");
  const [categoria, setCategoria] = useState(defaultValues?.categoria ?? "Almuerzo");
  const [tiempoPrep, setTiempoPrep] = useState<number | "">(defaultValues?.tiempoPrep ?? 30);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>(
    defaultValues?.ingredientes?.length
      ? defaultValues.ingredientes.map((i) => ({ ...i }))
      : [{ nombre: "", cantidad: "", unidad: "g" }]
  );
  const [pasos, setPasos] = useState<Paso[]>(
    defaultValues?.pasos?.length
      ? [...defaultValues.pasos]
      : [{ orden: 1, descripcion: "" }]
  );
  const [errs, setErrs] = useState<Record<string, string>>({});

  const clr = (k: string) => {
    if (errs[k]) setErrs((p) => ({ ...p, [k]: "" }));
  };

  function addIngrediente() { setIngredientes((a) => [...a, { nombre: "", cantidad: "", unidad: "g" }]); }
  function delIngrediente(i: number) { setIngredientes((a) => a.length > 1 ? a.filter((_, j) => j !== i) : a); }
  function setIng(i: number, k: keyof Ingrediente, v: string) {
    setIngredientes((a) => a.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  }

  function addPaso() { setPasos((a) => [...a, { orden: a.length + 1, descripcion: "" }]); }
  function delPaso(i: number) {
    setPasos((a) => a.length > 1 ? a.filter((_, j) => j !== i).map((p, idx) => ({ ...p, orden: idx + 1 })) : a);
  }
  function setPasoDesc(i: number, v: string) {
    setPasos((a) => a.map((p, j) => (j === i ? { ...p, descripcion: v } : p)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!titulo.trim()) er.titulo = "El título es obligatorio.";
    if (!descripcion.trim()) er.desc = "Añade una breve descripción del plato.";
    if (!ingredientes.some((i) => i.nombre.trim())) er.ings = "Añade al menos un ingrediente con nombre.";
    if (!pasos.some((p) => p.descripcion.trim())) er.pasos = "Añade al menos un paso de preparación.";
    setErrs(er);
    if (Object.keys(er).length) return;

    onSubmit({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      categoria,
      tiempoPrep: tiempoPrep === "" ? undefined : Number(tiempoPrep),
      ingredientes: ingredientes.filter((i) => i.nombre.trim()),
      pasos: pasos.filter((p) => p.descripcion.trim()),
    });
  }

  const hasErrors = Object.values(errs).some(Boolean);

  return (
    <div className="container form-page fade-in">
      <div className="head">
        <div className="eyebrow">{isEdit ? "Editar receta" : "Nueva receta"}</div>
        <h1>{isEdit ? titulo || "Editar receta" : "Comparte una receta"}</h1>
        <p>{isEdit ? "Actualiza los detalles de tu receta." : "Cuéntale a la comunidad cómo preparar uno de tus platos."}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Card 1: Lo básico */}
        <div className="form-card">
          <h3 className="fc-title">Lo básico</h3>
          <p className="fc-sub">El nombre y una breve descripción que abra el apetito.</p>

          <div className="field">
            <label className="label">Título de la receta</label>
            <input
              className={"input" + (errs.titulo ? " err" : "")}
              value={titulo}
              onChange={(e) => { setTitulo(e.target.value); clr("titulo"); }}
              placeholder="Ej. Risotto de setas y parmesano"
            />
            {errs.titulo && <div className="field-err">{errs.titulo}</div>}
          </div>

          <div className="field">
            <label className="label">Descripción</label>
            <textarea
              className={"textarea" + (errs.desc ? " err" : "")}
              value={descripcion}
              onChange={(e) => { setDescripcion(e.target.value); clr("desc"); }}
              placeholder="Una o dos frases que describan el plato…"
            />
            {errs.desc && <div className="field-err">{errs.desc}</div>}
          </div>

          <div className="row row-3">
            <div className="field" style={{ margin: 0 }}>
              <label className="label">Categoría</label>
              <select className="select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label className="label">Dificultad</label>
              <select className="select">
                {DIFFS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label className="label">Tiempo <span className="opt">(min)</span></label>
              <input
                className="input"
                type="number"
                min="1"
                value={tiempoPrep}
                onChange={(e) => setTiempoPrep(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Ingredientes */}
        <div className="form-card">
          <h3 className="fc-title">Ingredientes</h3>
          <p className="fc-sub">Añade tantos como necesites. Cantidad y unidad son opcionales.</p>
          {ingredientes.map((ing, i) => (
            <div className="ing-row" key={i}>
              <input
                className={"input" + (errs.ings && !ing.nombre.trim() ? " err" : "")}
                value={ing.nombre}
                onChange={(e) => { setIng(i, "nombre", e.target.value); clr("ings"); }}
                placeholder={`Ingrediente ${i + 1}`}
              />
              <input
                className="input"
                value={ing.cantidad}
                onChange={(e) => setIng(i, "cantidad", e.target.value)}
                placeholder="Cant."
              />
              <select className="select" value={ing.unidad} onChange={(e) => setIng(i, "unidad", e.target.value)}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <button type="button" className="row-del" onClick={() => delIngrediente(i)} title="Quitar">
                <TrashIcon size={16} />
              </button>
            </div>
          ))}
          {errs.ings && <div className="field-err">{errs.ings}</div>}
          <button type="button" className="add-row" onClick={addIngrediente}>
            <PlusIcon size={16} /> Añadir ingrediente
          </button>
        </div>

        {/* Card 3: Pasos */}
        <div className="form-card">
          <h3 className="fc-title">Pasos</h3>
          <p className="fc-sub">Describe la preparación paso a paso, en orden.</p>
          {pasos.map((paso, i) => (
            <div className="step-row" key={i}>
              <span className="num">{i + 1}</span>
              <textarea
                className={"textarea" + (errs.pasos && !paso.descripcion.trim() ? " err" : "")}
                value={paso.descripcion}
                onChange={(e) => { setPasoDesc(i, e.target.value); clr("pasos"); }}
                placeholder={`Describe el paso ${i + 1}…`}
              />
              <button type="button" className="row-del" onClick={() => delPaso(i)} title="Quitar" style={{ height: 42 }}>
                <TrashIcon size={16} />
              </button>
            </div>
          ))}
          {errs.pasos && <div className="field-err">{errs.pasos}</div>}
          <button type="button" className="add-row" onClick={addPaso}>
            <PlusIcon size={16} /> Añadir paso
          </button>
        </div>

        {hasErrors && (
          <div style={{ maxWidth: 760, margin: "16px auto 0", color: "var(--berry)", fontSize: 14, fontWeight: 600, textAlign: "right" }}>
            Revisa los campos marcados en rojo.
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isPending}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={isPending} style={{ opacity: isPending ? 0.85 : 1 }}>
            {isPending ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                <span className="spinner" /> Guardando…
              </span>
            ) : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
