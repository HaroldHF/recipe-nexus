FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
