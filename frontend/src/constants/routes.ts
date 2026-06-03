export const ROUTES = {
  INICIO: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DETALLE: "/recetas/:id",
  NUEVA_RECETA: "/nueva",
  EDITAR_RECETA: "/editar/:id",
  PERFIL: "/perfil",
} as const;

export const buildRoute = {
  detalle: (id: string) => `/recetas/${id}`,
  editar: (id: string) => `/editar/${id}`,
};
