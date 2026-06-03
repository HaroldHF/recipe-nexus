import { useLocation } from "react-router-dom";
import { AuthAside } from "../components/LoginRegister/AuthAside";
import { AuthForm } from "../components/LoginRegister/AuthForm";

export function LoginRegister() {
  const { pathname } = useLocation();
  const modo = pathname === "/register" ? "register" : "login";

  return (
    <div className="auth">
      <AuthAside modo={modo} />
      <AuthForm modo={modo} />
    </div>
  );
}
