import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";

export function PublicRoute() {
  const { token } = useAuthContext();
  return token ? <Navigate to={ROUTES.INICIO} replace /> : <Outlet />;
}
