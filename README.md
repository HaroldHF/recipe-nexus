# Recipe Nexus

Aplicación full-stack para gestión y descubrimiento de recetas. Permite registrarse, publicar recetas con ingredientes y pasos, comentar las de otros usuarios y filtrar por categoría.

## Tabla de contenidos
- [URL publicas](#url-publicas)
- [Arquitectura](#arquitectura)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Requisitos previos](#requisitos-previos)
- [Desarrollo local](#desarrollo-local)
- [Despliegue en VPS desde cero](#despliegue-en-vps-desde-cero)
- [Variables de entorno](#variables-de-entorno)
- [CI/CD con GitHub Actions](#cicd-con-github-actions)
- [Endpoints de la API](#endpoints-de-la-api)
- [Tests](#tests)

---

## URL PUBLICAS
- [APP:](https://app.recipe-nexus.xyz/)
- [API:](https://api.recipe-nexus.xyz/)

  
## Arquitectura

<img width="1169" height="827" alt="recipe-nexus-architecture drawio (1)" src="https://github.com/user-attachments/assets/c644dde1-25a7-4fd1-b016-af9292877f99" />


El backend y MongoDB corren dentro de la red Docker interna `recipenexus-net`. MongoDB **no** está accesible desde el exterior del VPS.

### Capas internas del backend

```
Routes → Auth middleware + Validator middleware (Zod) → Controllers → Services → Models (Mongoose)
```

Cada capa tiene una responsabilidad única: las rutas enlazan endpoints con middlewares y controladores; los middlewares validan JWT y DTOs antes de que la petición llegue al controlador; los controladores solo desempaquetan `req`/`res` y delegan; los services son los únicos que hablan con Mongoose.

---

## Stack tecnológico

**Backend**

| Tecnología | Versión | Rol |
|---|---|---|
| Node.js | 20+ | Entorno de ejecución |
| Express | 5.x | Framework HTTP |
| TypeScript | 6.x | Lenguaje |
| Mongoose | 9.x | ODM para MongoDB |
| MongoDB | 7 | Base de datos |
| Zod | 4.x | Validación de DTOs |
| jsonwebtoken | 9.x | Autenticación JWT |
| bcrypt | 6.x | Hash de contraseñas |
| Vitest | 4.x | Tests |

**Frontend**

| Tecnología | Versión | Rol |
|---|---|---|
| React | 19.x | UI |
| TypeScript | 6.x | Lenguaje |
| Vite | 8.x | Bundler |
| React Router | 7.x | Enrutamiento |
| TanStack Query | 5.x | Estado de servidor / caché |
| Axios | 1.x | Cliente HTTP |
| Tailwind CSS | 4.x | Estilos |
| React Hook Form | 7.x | Formularios |
| Zod | 4.x | Validación de formularios |

**Infraestructura**

- Docker + Docker Compose
- nginx (reverse proxy + TLS + archivos estáticos)
- GitHub Actions (CI/CD)
- pnpm como gestor de paquetes

---

## Estructura del repositorio

```
recipe-nexus/
├── .env.example                  # Plantilla de variables de entorno raíz
├── .github/
│   └── workflows/
│       ├── ci.yml                # Pipeline de tests (push a main y develop)
│       └── deploy.yml            # Pipeline de despliegue (tras CI exitoso en main)
├── docker-compose.yml            # Orquestación: mongo + api
├── Backend/
│   ├── Dockerfile                # Multi-stage build (builder + production)
│   ├── .env.template             # Plantilla de variables del backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   └── src/
│       ├── app.ts                # Configuración de Express y middlewares globales
│       ├── server.ts             # Punto de entrada (conecta DB y levanta servidor)
│       ├── config/db.ts          # Conexión a MongoDB
│       ├── models/               # Esquemas Mongoose
│       ├── middlewares/          # auth.middleware · validator.middleware
│       ├── validators/           # DTOs Zod por entidad
│       ├── controllers/          # Capa de presentación
│       ├── services/             # Lógica de negocio
│       ├── routes/               # Definición de endpoints
│       └── types/                # Extensiones de tipos de Express
└── frontend/
    ├── .env.development          # VITE_API_URL para dev local
    ├── .env.production           # VITE_API_URL para producción
    ├── package.json
    ├── index.html
    └── src/
        ├── api/                  # Instancia de Axios con interceptores JWT
        ├── constants/            # Rutas estáticas (ROUTES.*)
        ├── types/                # Interfaces globales TypeScript
        ├── services/             # Funciones de red por entidad
        ├── hooks/                # Custom hooks (TanStack Query)
        ├── pages/                # Las 6 pantallas principales
        └── components/           # Componentes UI organizados por página
```

---


## Requisitos previos

### Desarrollo local

- Node.js 20+
- pnpm 11+ (`npm install -g pnpm`)
- MongoDB local o URI de Atlas

### Producción (VPS)

- Ubuntu 22.04+ (o similar)
- Docker 24+
- Docker Compose v2+
- nginx
- Certbot (para TLS con Let's Encrypt)
- Acceso SSH con clave

---

## Desarrollo local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/recipe-nexus.git
cd recipe-nexus
```

### 2. Configurar variables de entorno del backend

```bash
cp Backend/.env.template Backend/.env
```

Editar `Backend/.env`:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/recipenexus
JWT_SECRET=un_secreto_largo_y_aleatorio_minimo_32_caracteres
FRONTEND_URL=http://localhost:5173
```

### 3. Instalar dependencias e iniciar el backend

```bash
cd Backend
pnpm install
pnpm dev
```

El servidor queda disponible en `http://localhost:4000`. El endpoint de salud es `GET /api/health`.

### 4. Instalar dependencias e iniciar el frontend

En otra terminal, desde la raíz del proyecto:

```bash
cd frontend
pnpm install
pnpm dev
```

La app queda disponible en `http://localhost:5173`.

> El archivo `frontend/.env.development` ya apunta a `https://api.recipe-nexus.xyz`. Para desarrollo local cambiá `VITE_API_URL=http://localhost:4000` o creá un `.env.local` que lo sobreescriba (`.env.local` está en `.gitignore` por convención de Vite).

---

## Despliegue en VPS desde cero

### 1. Preparar el VPS

Conectarse por SSH e instalar Docker:

```bash
ssh usuario@IP_DEL_VPS

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Verificar
docker --version
docker compose version
```

### 2. Instalar nginx y Certbot

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 3. Clonar el repositorio en el VPS

```bash
sudo mkdir -p /var/www/recipe-nexus
sudo chown $USER:$USER /var/www/recipe-nexus
cd /var/www/recipe-nexus
git clone https://github.com/tu-usuario/recipe-nexus.git
cd recipe-nexus
```

### 4. Crear el archivo `.env` en el VPS

Este archivo **nunca se sube a Git**. Crearlo manualmente en el VPS:

```bash
nano .env
```

Contenido:

```env
# MongoDB
MONGO_ROOT_USER=admin
MONGO_ROOT_PASS=una_contraseña_segura

# Backend
MONGO_URI=mongodb://admin:una_contraseña_segura@mongo:27017/recipenexus?authSource=admin
JWT_SECRET=un_secreto_muy_largo_y_aleatorio_de_al_menos_64_caracteres
FRONTEND_URL=https://recipe-nexus.xyz
```

> `mongo` en `MONGO_URI` es el nombre del servicio en `docker-compose.yml`, no `localhost`. Docker Compose resuelve ese nombre dentro de la red interna.

### 5. Levantar los contenedores

```bash
cd /var/www/recipe-nexus/recipe-nexus
docker compose up --build -d
```

Verificar que los contenedores estén corriendo:

```bash
docker compose ps
docker compose logs api --tail=30
```

Verificar el health check de la API (aún sin TLS):

```bash
curl http://localhost:4000/api/health
# {"status":"ok","timestamp":"..."}
```

### 6. Configurar nginx como reverse proxy

Crear el archivo de configuración de nginx:

```bash
sudo nano /etc/nginx/sites-available/recipe-nexus
```

Pegar esta configuración (reemplazá `recipe-nexus.xyz` con tu dominio real):

```nginx
server {
    listen 80;
    server_name recipe-nexus.xyz www.recipe-nexus.xyz api.recipe-nexus.xyz;

    # Redirigir todo a HTTPS (se completa después de Certbot)
    return 301 https://$host$request_uri;
}

# Frontend
server {
    listen 443 ssl;
    server_name recipe-nexus.xyz www.recipe-nexus.xyz;

    # Certbot completará estas líneas automáticamente
    # ssl_certificate ...
    # ssl_certificate_key ...

    root /var/www/recipe-nexus/recipe-nexus/frontend/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# API
server {
    listen 443 ssl;
    server_name api.recipe-nexus.xyz;

    # Certbot completará estas líneas automáticamente
    # ssl_certificate ...
    # ssl_certificate_key ...

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activar la configuración:

```bash
sudo ln -s /etc/nginx/sites-available/recipe-nexus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Obtener certificado TLS con Let's Encrypt

```bash
sudo certbot --nginx -d recipe-nexus.xyz -d www.recipe-nexus.xyz -d api.recipe-nexus.xyz
```

Certbot modifica automáticamente el archivo de nginx para agregar los certificados y redirigir HTTP → HTTPS.

Verificar renovación automática:

```bash
sudo certbot renew --dry-run
```

### 8. Build y despliegue del frontend

El build del frontend lo genera el pipeline de CI/CD (ver sección siguiente), pero para el primer despliegue manual:

```bash
# En local o en el VPS si tiene Node instalado
cd frontend
pnpm install
pnpm build   # genera frontend/dist/
```

Si buildás en local, copiar `frontend/dist/` al VPS:

```bash
scp -r frontend/dist/ usuario@IP_VPS:/var/www/recipe-nexus/recipe-nexus/frontend/
```

### 9. Verificar el despliegue completo

```bash
# Health check de la API
curl https://api.recipe-nexus.xyz/api/health

# La app debe cargar en el navegador
# https://recipe-nexus.xyz
```

---

## Variables de entorno

### Raíz (`.env`) — usadas por Docker Compose

| Variable | Descripción | Ejemplo |
|---|---|---|
| `MONGO_ROOT_USER` | Usuario root de MongoDB | `admin` |
| `MONGO_ROOT_PASS` | Contraseña root de MongoDB | `contraseña_segura` |
| `MONGO_URI` | URI de conexión para el backend | `mongodb://admin:pass@mongo:27017/recipenexus?authSource=admin` |
| `JWT_SECRET` | Secreto para firmar tokens JWT | Mínimo 32 caracteres aleatorios |
| `FRONTEND_URL` | Origen permitido por CORS | `https://recipe-nexus.xyz` |

### Frontend (`.env.production`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `https://api.recipe-nexus.xyz` |

> En desarrollo podés crear `frontend/.env.local` con `VITE_API_URL=http://localhost:4000`. Vite da prioridad a `.env.local` sobre `.env.development`.

---

## CI/CD con GitHub Actions

El pipeline está dividido en dos workflows:

### `ci.yml` — Tests (push a `main` y `develop`)

1. Instala dependencias del backend con `pnpm install --ignore-workspace`
2. Corre `pnpm test` (Vitest con `mongodb-memory-server` — no necesita MongoDB real)

### `deploy.yml` — Despliegue (tras CI exitoso en `main`)

1. Instala dependencias del frontend
2. Buildea el frontend con `VITE_API_URL=https://api.recipe-nexus.xyz`
3. Copia `frontend/dist/` al VPS por SCP
4. Conecta al VPS por SSH y ejecuta:
   - `git pull origin main`
   - `docker compose down && docker compose up --build -d`
   - Health check con reintentos (10 intentos × 10 segundos)
   - **Rollback automático** al commit anterior si el health check falla

### Secrets requeridos en GitHub

Ir a **Settings → Secrets and variables → Actions** y agregar:

| Secret | Descripción |
|---|---|
| `VPS_HOST` | IP o dominio del VPS |
| `VPS_USER` | Usuario SSH (ej: `ubuntu`) |
| `VPS_SSH_KEY` | Clave SSH privada (contenido completo del archivo `~/.ssh/id_rsa`) |

Para generar una clave SSH dedicada para el pipeline:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/deploy_key -N ""
# Agregar la clave pública al VPS:
ssh-copy-id -i ~/.ssh/deploy_key.pub usuario@IP_VPS
# El contenido de deploy_key (privada) va en el secret VPS_SSH_KEY
```

---

## Endpoints de la API

Base URL: `https://api.recipe-nexus.xyz/api`

### Health

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/health` | No | Estado del servidor |

### Auth

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | Registro de usuario |
| POST | `/auth/login` | No | Login, devuelve JWT |

### Recetas

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/recetas` | No | Listar recetas |
| GET | `/recetas/:id` | No | Detalle de una receta |
| POST | `/recetas` | Sí | Crear receta |
| PUT | `/recetas/:id` | Sí | Editar receta (solo el autor) |
| DELETE | `/recetas/:id` | Sí | Eliminar receta (solo el autor) |

### Comentarios

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/comentarios/receta/:id` | No | Comentarios de una receta |
| POST | `/comentarios` | Sí | Crear comentario |
| DELETE | `/comentarios/:id` | Sí | Eliminar comentario (solo el autor) |

> Los endpoints que requieren auth esperan el header `Authorization: Bearer <token>`.

---

## Tests

Los tests corren con Vitest y usan `mongodb-memory-server` para levantar una instancia de MongoDB en memoria, sin necesidad de una base de datos real.

```bash
cd Backend
pnpm test
```

El archivo `vitest.config.ts` configura:
- `fileParallelism: false` — los tests corren en serie para evitar conflictos entre instancias de MongoDB en memoria
- `hookTimeout: 120000` — tiempo extendido para que `mongodb-memory-server` descargue los binarios en la primera ejecución
- `JWT_SECRET=testsecret` — inyectado como variable de entorno para los tests de autenticación

Para correr un archivo específico:

```bash
pnpm test auth.test.ts
```

---

## Comandos útiles en producción

```bash
# Ver logs en tiempo real
docker compose logs -f api

# Reiniciar solo la API sin rebuildar
docker compose restart api

# Rebuildar y reiniciar tras cambios en el backend
docker compose up --build -d api

# Ver estado de los contenedores
docker compose ps

# Acceder a la shell del contenedor de la API
docker compose exec api sh

# Backup manual de MongoDB
docker compose exec mongo mongodump \
  --uri="mongodb://admin:CONTRASEÑA@localhost:27017/recipenexus?authSource=admin" \
  --out=/tmp/backup
docker cp recipenexus-mongo:/tmp/backup ./backup-$(date +%Y%m%d)
```
