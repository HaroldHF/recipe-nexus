import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { Inicio } from "../pages/Inicio";
import { LoginRegister } from "../pages/LoginRegister";
import { DetalleReceta } from "../pages/DetalleReceta";
import { NuevaReceta } from "../pages/NuevaReceta";
import { EditarReceta } from "../pages/EditarReceta";
import { Perfil } from "../pages/Perfil";

export const router = createBrowserRouter([
  // Rutas públicas (solo accesibles sin sesión)
  {
    element: <PublicRoute />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginRegister />,
      },
    ],
  },
  // Rutas protegidas (requieren sesión)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.INICIO,
        element: <Inicio />,
      },
      {
        path: ROUTES.PERFIL,
        element: <Perfil />,
      },
      {
        path: ROUTES.RECETA_DETALLE,
        element: <DetalleReceta />,
      },
      {
        path: ROUTES.RECETA_NUEVA,
        element: <NuevaReceta />,
      },
      {
        path: ROUTES.RECETA_EDITAR,
        element: <EditarReceta />,
      },
    ],
  },
]);
