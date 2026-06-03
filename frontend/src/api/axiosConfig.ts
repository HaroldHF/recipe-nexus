import axios from "axios";

// Base de la API tomada SIEMPRE de la variable de entorno (Vite la inyecta
// en build/dev desde .env.development / .env.production). Nada hardcodeado.
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
