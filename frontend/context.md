# 🔵 RecipeHub - Frontend Context & Development Rules

Este archivo define el estado actual, las herramientas instaladas, la arquitectura y las reglas de desarrollo específicas para la aplicación del **Frontend** (`/frontend`). Cualquier Agente de IA que asista en esta carpeta debe alinearse estrictamente a estas definiciones.

---

## 🛠️ 1. Stack Tecnológico Configurado

La aplicación está inicializada y lista para el desarrollo con el siguiente ecosistema:

- **Base:** React v18+ con Vite como empaquetador y servidor de desarrollo.
- **Lenguaje:** TypeScript (`.ts` para lógica pura y `.tsx` para componentes de interfaz).
- **Gestor de Paquetes:** `pnpm` (No usar `npm` ni `yarn` para instalar dependencias).
- **Manejo de Rutas:** React Router v6+ utilizando la API moderna de objetos (`createBrowserRouter` y `<RouterProvider />`).
- **Estado de Red y Caché:** TanStack Query (React Query) v5+ para la gestión eficiente de peticiones asíncronas y sincronización de datos con la API.
- **Estilos y UI:** Tailwind CSS v3.x configurado mediante directivas clásicas (`@tailwind base;` en `src/index.css`) y controlado por `tailwind.config.js`.

---

## 📂 2. Estructura de Carpetas Actual

La arquitectura de software está estrictamente desacoplada por responsabilidades dentro del directorio `src/`:

```text
frontend/
├── public/                 # Assets estáticos globales (favicons, SVGs de iconos)
├── src/
│   ├── api/                # Instancia centralizada de Axios e interceptores de JWT
│   │   └── axiosConfig.ts  # Configuración base de la URL ('/api') y Headers
│   ├── constants/          # Constantes globales del proyecto
│   │   └── routes.ts       # Diccionario estático de rutas (ROUTES.INICIO, etc.)
│   ├── types/              # Declaración de interfaces de TypeScript globales
│   │   └── index.ts        # Tipado de Usuario, Receta, Ingrediente, Comentario
│   ├── services/           # Funciones de red puras (Llamadas Axios organizadas por entidad)
│   │   ├── authService.ts  # Registro, Login y validación de sesión
│   │   └── recetaService.ts# CRUD de recetas y listado del inicio
│   ├── hooks/              # Custom hooks que encapsulan useQuery / useMutation de TanStack Query
│   │   ├── useAuth.ts
│   │   ├── useInicio.ts
│   │   ├── useDetalleReceta.ts
│   │   ├── useNuevaReceta.ts
│   │   ├── useEditarReceta.ts
│   │   └── usePerfil.ts
│   ├── pages/              # Las 6 pantallas principales requeridas por la rúbrica
│   │   ├── Inicio.tsx
│   │   ├── DetalleReceta.tsx
│   │   ├── NuevaReceta.tsx
│   │   ├── EditarReceta.tsx
│   │   ├── Perfil.tsx
│   │   └── LoginRegister.tsx
│   ├── components/         # Componentes UI reutilizables organizados por la página que los consume
│   │   ├── layouts/        # Layouts de estructura visual (MainLayout con Navbar/Footer)
│   │   ├── ProtectedRoute.tsx # Guardián de rutas autenticadas (requiere JWT)
│   │   ├── PublicRoute.tsx    # Guardián de rutas anónimas (bloquea si ya está logueado)
│   │   ├── PageLoader.tsx     # Spinner o pantalla de carga global
│   │   ├── Inicio/            # Componentes específicos de la Home (ej: InicioCard.tsx)
│   │   ├── DetalleReceta/
│   │   ├── EditarReceta/
│   │   ├── LoginRegister/
│   │   ├── NuevaReceta/
│   │   └── Perfil/
│   ├── App.tsx             # Configuración y cascarón visual principal
│   ├── router.tsx          # Definición del árbol de rutas de la aplicación
│   ├── main.tsx            # Punto de entrada (Inyección de QueryClientProvider y AuthProvider)
│   └── index.css           # Estilos globales e inicialización de Tailwind CSS
├── tsconfig.json           # Configuración de TypeScript
└── tailwind.config.js      # Configuración de rutas de compilación para Tailwind
```

Flujo
[Componente UI / Página] ──> [Custom Hook (TanStack Query)] ──> [Service (Axios)] ──> [API Backend]

La Página/Componente invoca un custom hook (ej: const { recetas, isLoading } = useInicio()).

El Custom Hook maneja de forma nativa los estados de carga (isLoading), éxito (data) o error (error) usando useQuery o useMutation.

El Servicio ejecuta la petición asíncrona hacia la base de Axios configurada (src/api/axiosConfig.ts).

URL Base: La instancia de Axios está configurada con rutas relativas hacia /api. No debe hardcodearse la IP o localhost:4000, ya que el servidor Nginx en producción redirigirá el tráfico de forma interna.

ontrol de Acceso Extensivo: Toda nueva vista o sub-ruta que requiera que el usuario esté logueado debe envolverse dentro del componente <ProtectedRoute /> en el archivo src/router.tsx. Las pantallas de login/registro se envuelven en <PublicRoute />.

Prohibido Fetch directo: Queda terminantemente prohibido utilizar fetch o instancias aisladas de axios dentro de los archivos de la carpeta pages/ o components/. Todo debe pasar por la capa de services/ y hooks/.

Tipado Obligatorio: No se permite el uso de any bajo ninguna circunstancia. Si una entidad no tiene un tipo asignado, debe crearse o extenderse su interfaz en src/types/index.ts.

Estilos Únicos: Todo el diseño estético de los componentes debe resolverse mediante clases utilitarias de Tailwind CSS. No crees archivos .css adicionales por componente ni utilices estilos en línea (style={{...}}).

Caché Eficiente: Al usar mutaciones (useMutation para crear, editar o borrar), se debe invocar obligatoriamente queryClient.invalidateQueries({ queryKey: [...] }) en el bloque onSuccess para limpiar la caché y forzar al frontend a pintar los datos actualizados de inmediato de manera reactiva.
