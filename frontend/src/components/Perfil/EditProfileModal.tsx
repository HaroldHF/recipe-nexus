import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePerfilDTOSchema, type UpdatePerfilDTO } from "../../types";
import type { Usuario } from "../../types";
import { useState } from "react";

interface EditProfileModalProps {
  usuario: Usuario;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdatePerfilDTO) => Promise<void>;
  isPending: boolean;
}

export function EditProfileModal({
  usuario,
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: EditProfileModalProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdatePerfilDTO>({
    resolver: zodResolver(UpdatePerfilDTOSchema),
    defaultValues: {
      nombre: usuario.nombre,
      email: usuario.email,
      avatarUrl: usuario.avatarUrl || "",
      currentPassword: "",
      newPassword: "",
    },
  });

  const watchNewPassword = watch("newPassword");

  if (!isOpen) return null;

  const handleFormSubmit = async (data: UpdatePerfilDTO) => {
    setErrorMsg(null);
    if (data.newPassword && !data.currentPassword) {
      setErrorMsg("Debe ingresar la contraseña actual para establecer una nueva contraseña.");
      return;
    }
    try {
      await onSubmit(data);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || "Error al actualizar el perfil.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
      <div className="bg-paper border border-line rounded-2xl w-full max-w-md shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Head */}
        <div className="p-5 border-b border-line flex justify-between items-center bg-cream-2/55">
          <div>
            <h2 className="text-xl font-bold font-serif text-ink">Editar Perfil</h2>
            <p className="text-xs text-muted mt-0.5">Actualiza tu información personal</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink font-bold text-lg p-1.5 cursor-pointer"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 flex-1 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="bg-berry/10 border border-berry/20 text-berry text-sm font-semibold p-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Nombre */}
          <div className="field">
            <label className="label">Nombre completo</label>
            <input
              type="text"
              className={`input ${errors.nombre ? "err" : ""}`}
              placeholder="Tu nombre completo"
              {...register("nombre")}
            />
            {errors.nombre && <div className="field-err">{errors.nombre.message}</div>}
          </div>

          {/* Email */}
          <div className="field">
            <label className="label">Correo electrónico</label>
            <input
              type="email"
              className={`input ${errors.email ? "err" : ""}`}
              placeholder="ejemplo@correo.com"
              {...register("email")}
            />
            {errors.email && <div className="field-err">{errors.email.message}</div>}
          </div>

          {/* avatarUrl */}
          <div className="field">
            <label className="label">URL de Foto de Perfil</label>
            <input
              type="text"
              className={`input ${errors.avatarUrl ? "err" : ""}`}
              placeholder="https://ejemplo.com/foto.jpg"
              {...register("avatarUrl")}
            />
            {errors.avatarUrl && <div className="field-err">{errors.avatarUrl.message}</div>}
          </div>

          {/* Password change divider */}
          <div className="border-t border-line pt-4 mt-6">
            <h3 className="text-sm font-bold text-ink-soft mb-3">Cambiar contraseña</h3>
            <p className="text-xs text-muted mb-4">Completa estos campos si deseas modificar tu contraseña.</p>

            {/* Current Password */}
            <div className="field">
              <label className="label">
                Contraseña actual{" "}
                {watchNewPassword && <span className="text-berry font-bold">*</span>}
              </label>
              <input
                type="password"
                className={`input ${errors.currentPassword ? "err" : ""}`}
                placeholder="••••••••"
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <div className="field-err">{errors.currentPassword.message}</div>
              )}
            </div>

            {/* New Password */}
            <div className="field">
              <label className="label">Contraseña nueva</label>
              <input
                type="password"
                className={`input ${errors.newPassword ? "err" : ""}`}
                placeholder="Mínimo 6 caracteres"
                {...register("newPassword")}
              />
              {errors.newPassword && <div className="field-err">{errors.newPassword.message}</div>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-line">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm px-5"
              disabled={isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm px-5"
              disabled={isPending}
            >
              {isPending ? <span className="spinner" /> : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
