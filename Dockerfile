# =============================================================================
# Stage 1: Builder — install deps & build the static site
#  
# Select locale to build yarn build --locale <locale>  or yarn build for all locales
# =============================================================================
FROM node:20-alpine AS builder
RUN apk add --no-cache \
    git \
    python3 \
    py3-pip \
    make \
    g++ \
    cmake \
    libc6-compat \
    && ln -sf python3 /usr/bin/python

WORKDIR /app
COPY . .
RUN NODE_OPTIONS="--dns-result-order=ipv4first" \
    yarn install --frozen-lockfile
RUN yarn build --locale en

# =============================================================================
# Stage 2: Production — lightweight Nginx image to serve the built site
# =============================================================================
FROM nginx:1.27-alpine AS production
COPY --from=builder /app/website/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# =============================================================================
# Stage 3 (optional): Dev server — for local development with hot reload
# =============================================================================

FROM node:20-alpine AS development
 
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    cmake \
    libc6-compat \
    && ln -sf python3 /usr/bin/python
 
WORKDIR /app
 
RUN yarn config set registry https://registry.npmjs.org/ && \
    yarn config set network-timeout 600000
 
# Copy full repo first — lerna.json is required by postinstall scripts
COPY . .
 
RUN node -e " \
    const fs = require('fs'); \
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')); \
    if (!pkg.private) { pkg.private = true; } \
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2)); \
"
 
RUN NODE_OPTIONS="--dns-result-order=ipv4first" \
    yarn install --frozen-lockfile
 
EXPOSE 3000
 
CMD ["yarn", "start", "--host", "0.0.0.0"]
 