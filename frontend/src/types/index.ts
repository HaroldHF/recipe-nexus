export interface Ingrediente {
  nombre: string;
  cantidad: string;
  unidad: string;
}

export interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  avatarUrl?: string;
}

export interface Receta {
  _id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  tiempoMin: number;
  porciones: number;
  dificultad: string;
  ingredientes: Ingrediente[];
  pasos: string[];
  tags?: string[];
  autorId: Usuario | string;
  imagenUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comentario {
  _id: string;
  texto: string;
  calificacion: number;
  usuarioId: Usuario | string;
  recetaId: string;
  createdAt: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  nombre: string;
  email: string;
  password: string;
}

export interface RecetaFormDTO {
  titulo: string;
  descripcion: string;
  categoria?: string;
  tiempoMin?: number;
  porciones?: number;
  dificultad?: string;
  ingredientes: Ingrediente[];
  pasos: string[];
  tags?: string[];
  imagenUrl?: string;
}

export interface ComentarioFormDTO {
  texto: string;
  calificacion: number;
}
