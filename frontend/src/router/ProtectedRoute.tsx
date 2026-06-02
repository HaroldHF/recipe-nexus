import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";
import { PageLoader } from "../components/PageLoader"; // Spinner de carga

export function ProtectedRoute() {
  //const { isAuthenticated, loading } = useAuth();
  //if (loading) return <PageLoader />;
  // Si está autenticado, lo deja pasar a la vista interna; si no, lo manda al Login
  // return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
}
