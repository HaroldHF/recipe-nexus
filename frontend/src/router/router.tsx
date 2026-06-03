import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { MainLayout } from "../components/layouts/MainLayout";
import { Inicio } from "../pages/Inicio";
import { LoginRegister } from "../pages/LoginRegister";
import { DetalleReceta } from "../pages/DetalleReceta";
import { NuevaReceta } from "../pages/NuevaReceta";
import { EditarReceta } from "../pages/EditarReceta";
import { Perfil } from "../pages/Perfil";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Rutas públicas accesibles por cualquiera
      { index: true, element: <Inicio /> },
      { path: "recetas/:id", element: <DetalleReceta /> },

      // Solo accesibles sin sesión activa
      {
        element: <PublicRoute />,
        children: [
          { path: ROUTES.LOGIN.slice(1), element: <LoginRegister /> },
          { path: ROUTES.REGISTER.slice(1), element: <LoginRegister /> },
        ],
      },

      // Requieren sesión activa
      {
        element: <ProtectedRoute />,
        children: [
          { path: ROUTES.NUEVA_RECETA.slice(1), element: <NuevaReceta /> },
          { path: "editar/:id", element: <EditarReceta /> },
          { path: ROUTES.PERFIL.slice(1), element: <Perfil /> },
        ],
      },
    ],
  },
]);
