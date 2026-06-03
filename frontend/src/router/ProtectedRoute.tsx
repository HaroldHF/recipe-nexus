import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";
import { PageLoader } from "../components/PageLoader";

export function ProtectedRoute() {
  const { token } = useAuthContext();

  if (token === undefined) return <PageLoader />;
  return token ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
}
