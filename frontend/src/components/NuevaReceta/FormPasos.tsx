import type { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { RecetaFormDTO } from "../../types/index";
import { PlusIcon, TrashIcon } from "../shared/Icons";

interface Props {
  control: Control<RecetaFormDTO>;
  register: UseFormRegister<RecetaFormDTO>;
  errors: FieldErrors<RecetaFormDTO>;
}

export function FormPasos({ control, register, errors }: Props) {
  const { fields, append, remove } = useFieldArray<RecetaFormDTO>({
    control,
    name: "pasos",
  });

  return (
    <div className="form-card">
      <h3 className="fc-title">Pasos</h3>
      <p className="fc-sub">Describe la preparación paso a paso, en orden.</p>

      {fields.map((field, i) => (
        <div key={field.id} style={{ marginBottom: 12 }}>
          <div className="step-row">
            <span className="num">{i + 1}</span>
            <textarea
              className={`textarea${errors.pasos?.[i]?.value ? " err" : ""}`}
              placeholder={`Describe el paso ${i + 1}…`}
              {...register(`pasos.${i}.value`)}
            />
            <button
              type="button"
              className="row-del"
              onClick={() => fields.length > 1 && remove(i)}
              title="Quitar"
              style={{ height: 42 }}
            >
              <TrashIcon size={16} />
            </button>
          </div>

          {/* CORREGIDO: Muestra el mensaje si un paso de texto queda completamente vacío */}
          {errors.pasos?.[i]?.value && (
            <div className="field-err" style={{ marginTop: 4, marginLeft: 36 }}>
              {errors.pasos[i].value.message}
            </div>
          )}
        </div>
      ))}

      {errors.pasos?.root && (
        <div className="field-err">{errors.pasos.root.message}</div>
      )}

      <button
        type="button"
        className="add-row"
        onClick={() => append({ value: "" })}
      >
        <PlusIcon size={16} /> Añadir paso
      </button>
    </div>
  );
}
