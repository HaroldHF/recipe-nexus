import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";
import { PageLoader } from "../components/PageLoader";

export function PublicRoute() {
  //const { isAuthenticated, loading } = useAuth();
  //if (loading) return <PageLoader />;
  // Si ya inició sesión, lo rebota a la raíz (Inicio). Si no, lo deja loguearse libremente.
  // return !isAuthenticated ? (
  //   <Outlet />
  // ) : (
  //   <Navigate to={ROUTES.INICIO} replace />
  // );
}
