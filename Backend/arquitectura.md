# 🟢 RecipeHub - Backend Context & Development Rules

Este archivo define el estado actual, las herramientas instaladas, la arquitectura por capas y las restricciones académicas obligatorias para la aplicación del **Backend** (`/backend`). Cualquier Agente de IA que asista en esta carpeta debe alinearse estrictamente a estas definiciones.

---

## 🛠️ 1. Stack Tecnológico Configurado

La API está construida y lista para el desarrollo sobre el siguiente ecosistema:

- **Entorno:** Node.js v20+ utilizando módulos nativos de JavaScript (ES Modules, `"type": "module"` habilitado en `package.json`).
- **Framework Web:** Express.js para la gestión de servidores, enrutamiento y ciclo de solicitudes/respuestas HTTP.
- **Base de Datos & ORM:** MongoDB gestionado mediante Mongoose como modelador de objetos.
- **Validación de Datos (DTO):** Zod para el análisis estructural de datos de entrada y eliminación de propiedades no autorizadas.
- **Seguridad & Auth:** `bcrypt` para el hashing seguro de contraseñas y `jsonwebtoken` (JWT) para la generación de tokens de sesión.
- **CORS:** Configurado globalmente para permitir solicitudes seguras desde el subdominio del Frontend.

---

## 📂 2. Estructura de Carpetas Actual

La API implementa una arquitectura limpia simplificada basada en separación de responsabilidades por capas:

```text
backend/
├── src/
│   ├── config/          # Inicialización de servicios y bases de datos externos
│   │   └── db.js        # Conexión centralizada a MongoDB con Mongoose
│   ├── models/          # Capa de Datos (Esquemas y Entidades de Mongoose)
│   │   ├── usuario.model.js
│   │   ├── receta.model.js
│   │   └── comentario.model.js
│   ├── middlewares/     # Guardianes de ciclo de vida (Seguridad e Interceptores)
│   │   ├── auth.middleware.js      # Valida el JWT inyectando el usuario en req.usuario
│   │   └── validator.middleware.js # Middleware genérico para procesar esquemas de Zod
│   ├── validators/      # DTOs y validaciones de esquema estructural (Zod)
│   │   ├── auth.validator.js       # Reglas de registro y login
│   │   └── receta.validator.js     # Reglas para creación y edición de recetas
│   ├── services/        # Capa de Negocio (Consultas puras a Mongoose y lógica)
│   │   ├── auth.service.js
│   │   ├── receta.service.js
│   │   └── comentario.service.js
│   ├── controllers/     # Capa de Presentación (Recibe req, delega y responde con res)
│   │   ├── health.controller.js
│   │   ├── auth.controller.js
│   │   ├── receta.controller.js
│   │   └── comentario.controller.js
│   ├── routes/          # Definición y mapeo explícito de los endpoints
│   │   ├── index.js     # Centralizador global de todas las rutas de la API
│   │   ├── health.routes.js
│   │   ├── auth.routes.js
│   │   ├── receta.routes.js
│   │   └── comentario.routes.js
│   ├── app.js           # Configuración de Express e inyección de middlewares globales
│   └── server.js        # Punto de entrada de la aplicación (Escucha el puerto)
├── package.json         # Scripts de ejecución (pnpm dev, pnpm start, pnpm build)
└── .env                 # Archivo de variables de entorno (Ignorado en Git)

🚨 3. Reglas de Oro y Restricciones Académicas (PROHIBIDO ROMPER)
Cualquier fragmento de código generado debe respetar estas 5 condiciones o el proyecto fallará la evaluación:

Modelo de Recetas con Estructura Embebida Obligatoria: Los ingredientes (nombre, cantidad, unidad) y los pasos de preparación de una receta deben ser almacenados estrictamente como arreglos embebidos (subdocumentos) dentro del mismo documento de la receta en MongoDB. NO se permite crear colecciones independientes para ingredientes o pasos.

Modelo de Comentarios con Referencias: Los comentarios deben vivir en una colección independiente y almacenar el vínculo mediante referencias por ID (Schema.Types.ObjectId) apuntando hacia la colección de Usuarios y de Recetas.

Endpoint Obligatorio /api/health: Debe existir un endpoint público en GET /api/health que responda un estado 200 OK con un JSON que contenga un status: "ok" y la marca de tiempo actual (timestamp). Es vital para el Health Check del pipeline de CI/CD.

Uso Exclusivo de JavaScript Puro: Toda la carpeta del backend utiliza JavaScript estándar de última generación. Las importaciones locales deben llevar obligatoriamente la extensión .js al final (ej. import { Receta } from '../models/receta.model.js';). No omitas el .js.

Aislamiento Absoluto de Variables: Ninguna credencial, puerto, secreto de JWT o URI de Mongo debe estar escrita directamente en el código. Todo se lee de forma dinámica desde process.env.

🎚️ 4. Flujo de Control y Reglas de Capas para la IA
Cuando el agente de IA escriba un nuevo endpoint, debe mapearlo de extremo a extremo respetando los siguientes principios:

Rutas (routes/): Unen el endpoint con los middlewares y el controlador. Lucen limpias: router.post('/', verificarJWT, validarDTO(crearRecetaSchema), recetaController.crear);.

Middlewares de Validación (validators/): Utilizan Zod. El validador procesa el cuerpo con .parse(). Si es inválido, el middleware genérico intercepta el error y responde inmediatamente con un 400 Bad Request detallando qué campo falló, evitando que la solicitud llegue al controlador.

Controladores (controllers/): Su única función es desempaquetar la petición HTTP (req.body, req.params, req.usuario), invocar al método del servicio en un bloque try/catch y responder con el código de estado HTTP correspondiente (201, 200, 404, 500). Los controladores nunca importan ni consultan modelos de Mongoose de forma directa.

Servicios (services/): Contienen toda la lógica de negocio y son los únicos autorizados para comunicarse con Mongoose (Receta.find(), new Receta(), etc.). Los servicios no tienen acceso a los objetos req o res de Express; operan con argumentos limpios y retornan datos o promesas.
```
