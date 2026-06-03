export interface Ingrediente {
  nombre: string;
  cantidad: string;
  unidad: string;
}

export interface Paso {
  orden: number;
  descripcion: string;
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
  ingredientes: Ingrediente[];
  pasos: Paso[];
  autor: Usuario | string;
  categoria: string;
  tiempoPrep?: number;
  imagenUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comentario {
  _id: string;
  contenido: string;
  autor: Usuario | string;
  receta: string;
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
  ingredientes: Ingrediente[];
  pasos: Paso[];
  categoria?: string;
  tiempoPrep?: number;
  imagenUrl?: string;
}
