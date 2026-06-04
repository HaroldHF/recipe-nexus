# syntax=docker/dockerfile:1

# ----------------------------------------------------------------------------
# Etapa 1: builder — instala TODAS las dependencias, compila bcrypt (nativo)
# y transpila TypeScript a JavaScript (tsc -> /app/dist).
# ----------------------------------------------------------------------------
FROM node:20-slim AS builder

# Herramientas de compilación para módulos nativos (bcrypt).
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

WORKDIR /app

# Manifiestos primero para aprovechar la caché de capas de Docker.
COPY package.json pnpm-lock.yaml .npmrc ./

# Instala todo (incluidas devDependencies como typescript) para poder buildear.
RUN pnpm install --frozen-lockfile
# Asegura que el binario nativo de bcrypt quede compilado en este entorno Linux.
RUN pnpm rebuild bcrypt

# Código fuente + configuración de compilación.
COPY tsconfig.json ./
COPY src ./src

# Compila TypeScript -> dist/ (outDir definido en tsconfig.json).
# Se desactivan declaration/declarationMap: los .d.ts no se usan en runtime y,
# bajo el node_modules aislado de pnpm, su emisión dispara TS2883 con los tipos
# de express. El JS de salida (dist/server.js) es idéntico.
RUN pnpm exec tsc --declaration false --declarationMap false

# Elimina las devDependencies dejando solo lo necesario para producción.
RUN pnpm prune --prod

# ----------------------------------------------------------------------------
# Etapa 2: production — imagen final mínima, sin toolchain ni devDependencies.
# ----------------------------------------------------------------------------
FROM node:20-slim AS production

ENV NODE_ENV=production

WORKDIR /app

# node_modules ya podado (con bcrypt compilado) + artefactos de build.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

EXPOSE 4000

CMD ["node", "dist/server.js"]
