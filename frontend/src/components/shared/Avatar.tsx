import type { Usuario } from "../../types";

interface AvatarProps {
  usuario: Usuario;
  size?: number;
}

export function Avatar({ usuario, size = 36 }: AvatarProps) {
  if (usuario.avatarUrl) {
    return (
      <img
        src={usuario.avatarUrl}
        alt={usuario.nombre}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className="rounded-full bg-orange-soft text-orange-d grid place-items-center font-extrabold uppercase shrink-0"
    >
      {usuario.nombre.charAt(0)}
    </div>
  );
}
