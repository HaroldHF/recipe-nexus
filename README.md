# Recipe Nexus (RecipeHub)

Aplicación colaborativa de recetas de cocina desarrollada para el examen de Programación IV.

## Estructura del Proyecto
- `Backend/`: API RESTful usando Node.js, Express y MongoDB.
- `frontend/`: Aplicación SPA con React (Vite).

## Pruebas del Backend (Testing)

Se ha configurado una completa suite de pruebas automatizadas en el Backend utilizando **Vitest** y **Supertest**, integradas junto a `mongodb-memory-server` para realizar pruebas reales de Base de Datos directamente en memoria sin afectar la información en producción.

### Cobertura de las Pruebas (16 Tests)
- **API Health:** Verificación de estado del servidor (`/api/health`).
- **Autenticación:** Tests del flujo de registro, validación de datos, encriptado, login y generación del JSON Web Token (JWT).
- **Recetas (CRUD):** Creación, listado, lectura por ID, edición y eliminación (verificando autoría de usuarios).
- **Comentarios:** Inserción y eliminación de comentarios en las recetas correspondientes.

### Instrucciones para ejecutar los tests

1. Abre tu terminal y navega a la carpeta del Backend:
   ```bash
   cd Backend
   ```

2. Instala las dependencias (en caso de no haberlo hecho antes) usando pnpm:
   ```bash
   pnpm install
   ```

3. Ejecuta los tests:
   ```bash
   pnpm test
   ```
   *(También puedes utilizar `npx vitest run` directamente si prefieres no usar los scripts de pnpm)*

> **Nota:** La primera vez que ejecutes los tests de integración, `mongodb-memory-server` descargará de forma automática el binario de MongoDB en segundo plano (aprox. 700 MB). Por esta razón la ejecución inicial podría tomar uno o dos minutos, pero las posteriores serán instantáneas.