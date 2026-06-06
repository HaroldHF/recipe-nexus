import type { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { RecetaFormDTO } from "../../types/index";
import { UNIDADES } from "../../constants/ingredientes";
import { PlusIcon, TrashIcon } from "../shared/Icons";

interface Props {
  control: Control<RecetaFormDTO>;
  register: UseFormRegister<RecetaFormDTO>;
  errors: FieldErrors<RecetaFormDTO>;
}

export function FormIngredientes({ control, register, errors }: Props) {
  const { fields, append, remove } = useFieldArray<RecetaFormDTO>({
    control,
    name: "ingredientes",
  });

  return (
    <div className="form-card">
      <h3 className="fc-title">Ingredientes</h3>
      <p className="fc-sub">
        Añade tantos como necesites. Cantidad y unidad son opcionales.
      </p>

      {fields.map((field, i) => (
        <div key={field.id} style={{ marginBottom: 12 }}>
          <div className="ing-row">
            <input
              className={`input${errors.ingredientes?.[i]?.nombre ? " err" : ""}`}
              placeholder={`Ingrediente ${i + 1}`}
              {...register(`ingredientes.${i}.nombre`)}
            />
            {/* CORREGIDO: Añadida clase err dinámica al input de cantidad */}
            <input
              className={`input${errors.ingredientes?.[i]?.cantidad ? " err" : ""}`}
              placeholder="Cant."
              {...register(`ingredientes.${i}.cantidad`)}
            />
            <select
              className="select"
              {...register(`ingredientes.${i}.unidad`)}
            >
              {UNIDADES.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="row-del"
              onClick={() => fields.length > 1 && remove(i)}
              title="Quitar"
            >
              <TrashIcon size={16} />
            </button>
          </div>

          {/* Muestra el mensaje si falla el nombre */}
          {errors.ingredientes?.[i]?.nombre && (
            <div className="field-err" style={{ marginTop: 4 }}>
              {errors.ingredientes[i].nombre.message}
            </div>
          )}

          {/* CORREGIDO: Muestra el mensaje si falla la cantidad (ej. si ponen letras o símbolos inválidos) */}
          {errors.ingredientes?.[i]?.cantidad && (
            <div className="field-err" style={{ marginTop: 4 }}>
              {errors.ingredientes[i].cantidad.message}
            </div>
          )}
        </div>
      ))}

      {errors.ingredientes?.root && (
        <div className="field-err">{errors.ingredientes.root.message}</div>
      )}

      <button
        type="button"
        className="add-row"
        onClick={() => append({ nombre: "", cantidad: "", unidad: "g" })}
      >
        <PlusIcon size={16} /> Añadir ingrediente
      </button>
    </div>
  );
}
