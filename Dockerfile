# syntax=docker/dockerfile:1

FROM node:24.21-bookworm-slim AS build

ENV COREPACK_HOME=/tmp/corepack
ENV CI=true

WORKDIR /app

# Activate the exact package-manager version declared by the repository.
RUN corepack enable && corepack prepare pnpm@12.3.4 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
COPY packages/*/package.json packages/*/package.json
COPY website/package.json website/package.json
COPY argos/package.json argos/package.json

RUN pnpm install --frozen-lockfile

COPY . .

# The postinstall step builds the workspace packages required by the website.
RUN pnpm build:website

FROM nginx:1.29-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/website/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
