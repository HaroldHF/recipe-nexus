import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RecetaFormDTOSchema,
  type RecetaFormDTO,
  type RecetaPayload,
} from "../../types/index";
import { CATEGORIAS, DIFICULTADES } from "../../constants/recetas";
import { FormImageDropZone } from "./FormImageDropZone";
import { FormIngredientes } from "./FormIngredientes";
import { FormPasos } from "./FormPasos";

interface FormRecetaProps {
  defaultValues?: Partial<RecetaFormDTO>;
  isPending: boolean;
  submitLabel: string;
  isEdit?: boolean;
  onSubmit: (data: RecetaPayload) => void;
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
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecetaFormDTO>({
    resolver: zodResolver(RecetaFormDTOSchema) as any,
    defaultValues: {
      titulo: defaultValues?.titulo ?? "",
      descripcion: defaultValues?.descripcion ?? "",
      categoria: defaultValues?.categoria ?? "Almuerzo",
      dificultad: defaultValues?.dificultad ?? "Fácil",
      tiempoMin: defaultValues?.tiempoMin ?? 30,
      porciones: defaultValues?.porciones ?? 2,
      tags: defaultValues?.tags ?? [],
      imagenUrl: defaultValues?.imagenUrl ?? "",
      ingredientes: defaultValues?.ingredientes?.length
        ? defaultValues.ingredientes
        : [{ nombre: "", cantidad: "", unidad: "g" }],
      pasos: defaultValues?.pasos?.length
        ? defaultValues.pasos.map((v: string | { value: string }) => ({
            value: typeof v === "string" ? v : (v as { value: string }).value,
          }))
        : [{ value: "" }],
    },
  });

  function handleFormSubmit(data: RecetaFormDTO) {
    onSubmit({
      ...data,
      ingredientes: data.ingredientes.filter((i) => i.nombre?.trim()),
      pasos: data.pasos.map((p) => p?.value?.trim() ?? "").filter(Boolean),
      imagenUrl: data.imagenUrl?.trim() || undefined,
    });
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="container form-page fade-in" style={{ padding: "16px" }}>
      <div className="head" style={{ marginBottom: 24 }}>
        <div className="eyebrow">
          {isEdit ? "Editar receta" : "Nueva receta"}
        </div>
        <h1 style={{ fontSize: "calc(1.8rem + 1vw)" }}>
          {isEdit ? "Editar receta" : "Comparte una receta"}
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>
          {isEdit
            ? "Actualiza los detalles de tu receta."
            : "Cuéntale a la comunidad cómo preparar uno de tus platos."}
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* ── Card 1: Lo básico ─────────────────────────────── */}
        <div className="form-card">
          <h3 className="fc-title">Lo básico</h3>
          <p className="fc-sub">
            El nombre y una breve descripción que abra el apetito.
          </p>

          <div className="field">
            <label className="label">Título de la receta</label>
            <input
              className={`input${errors.titulo ? " err" : ""}`}
              placeholder="Ej. Risotto de setas y parmesano"
              {...register("titulo")}
            />
            {errors.titulo && (
              <div className="field-err">{errors.titulo.message}</div>
            )}
          </div>

          <div className="field">
            <label className="label">Descripción</label>
            <textarea
              className={`textarea${errors.descripcion ? " err" : ""}`}
              placeholder="Una o dos frases que describan el plato…"
              {...register("descripcion")}
            />
            {errors.descripcion && (
              <div className="field-err">{errors.descripcion.message}</div>
            )}
          </div>

          <div className="field">
            <label className="label">
              Imagen <span className="opt">(opcional)</span>
            </label>
            <Controller
              control={control}
              name="imagenUrl"
              render={({ field }) => (
                <FormImageDropZone
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          {/* CORREGIDO: Flexbox responsivo para Categoría, Dificultad y Tiempo */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 16,
            }}
          >
            <div className="field" style={{ flex: "1 1 140px", margin: 0 }}>
              <label className="label">Categoría</label>
              <select className="select" {...register("categoria")}>
                {CATEGORIAS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="field" style={{ flex: "1 1 140px", margin: 0 }}>
              <label className="label">Dificultad</label>
              <select className="select" {...register("dificultad")}>
                {DIFICULTADES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="field" style={{ flex: "1 1 100px", margin: 0 }}>
              <label className="label">
                Tiempo <span className="opt">(min)</span>
              </label>
              <input
                className={`input${errors.tiempoMin ? " err" : ""}`}
                type="number"
                min="1"
                {...register("tiempoMin")}
              />
              {errors.tiempoMin && (
                <div className="field-err">{errors.tiempoMin.message}</div>
              )}
            </div>
          </div>

          {/* CORREGIDO: Flexbox responsivo para Porciones y Tags */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 12,
            }}
          >
            <div className="field" style={{ flex: "1 1 100px", margin: 0 }}>
              <label className="label">Porciones</label>
              <input
                className={`input${errors.porciones ? " err" : ""}`}
                type="number"
                min="1"
                {...register("porciones")}
              />
              {errors.porciones && (
                <div className="field-err">{errors.porciones.message}</div>
              )}
            </div>

            <div className="field" style={{ flex: "2 1 200px", margin: 0 }}>
              <label className="label">
                Tags <span className="opt">(separados por comas)</span>
              </label>
              <input
                className="input"
                type="text"
                placeholder="Ej. vegano, rápido, sin gluten"
                {...register("tags", {
                  setValueAs: (v: string | string[]) =>
                    typeof v === "string"
                      ? v
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                      : v,
                })}
              />
            </div>
          </div>
        </div>

        {/* ── Card 2: Ingredientes ─────────────────────────── */}
        <FormIngredientes
          control={control}
          register={register}
          errors={errors}
        />

        {/* ── Card 3: Pasos ────────────────────────────────── */}
        <FormPasos control={control} register={register} errors={errors} />

        {hasErrors && (
          <div
            style={{
              color: "var(--berry)",
              fontSize: 14,
              fontWeight: 600,
              textAlign: "center",
              marginTop: 16,
            }}
          >
            Revisa los campos marcados en rojo.
          </div>
        )}

        {/* CORREGIDO: Botones inferiores responsivos (ocupan ancho completo uno encima de otro en móviles) */}
        <div
          className="form-actions"
          style={{
            display: "flex",
            gap: 12,
            marginTop: 24,
            flexDirection: "column-reverse", // En celular el "Cancelar" queda abajo y "Guardar" arriba muy natural
          }}
        >
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={isPending}
            style={{ width: "100%", justifyContent: "center" }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isPending}
            style={{
              opacity: isPending ? 0.85 : 1,
              width: "100%",
              justifyContent: "center",
            }}
          >
            {isPending ? (
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 9 }}
              >
                <span className="spinner" /> Guardando…
              </span>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
