import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";
import * as authService from "../services/authService";

export function useAuth() {
  const { usuario, token, login: contextLogin, logout } = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: ({ token: t, usuario: u }) => {
      contextLogin(t, u);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
  });

  return { usuario, token, loginMutation, registerMutation, logout };
}
