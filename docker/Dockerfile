# ============================================================
# Stage 0: Base image with latest Alpine security patches
# ============================================================
FROM node:26.7.0-alpine3.24 AS base

# Pull in patched apk packages (e.g. libssl3/libcrypto3 CVEs) not yet
# baked into the upstream node:alpine tag
RUN apk update && apk upgrade --no-cache

# ============================================================
# Stage 1: Install dependencies
# ============================================================
FROM base AS deps

# Build arg: 'development' installs devDeps, 'production' skips them
ARG NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN if [ "$NODE_ENV" = "development" ]; then \
      npm install && npm cache clean --force; \
    else \
      npm ci --omit=dev && npm cache clean --force; \
    fi

# ============================================================
# Stage 2: Production image (default target)
# ============================================================
FROM base AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

LABEL maintainer="Francis J. García <contacto@francisjgarcia.es>" \
      description="Personal landing page - Node.js + Express" \
      org.opencontainers.image.source="https://github.com/francisjgarcia/francisjgarcia.es" \
      org.opencontainers.image.ref.name="francisjgarcia" \
      org.opencontainers.image.authors="Francis J. García"

RUN adduser -D -u 1001 app

WORKDIR /app

ENV PORT=3000

COPY --from=deps --chown=app:app /app/node_modules node_modules
COPY --chown=app:app src src
COPY --chown=app:app public public

USER app

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

EXPOSE 3000

CMD ["node", "src/server.js"]

# ============================================================
# Stage 3: Development image (hot reload with --watch)
# ============================================================
FROM base AS development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

LABEL maintainer="Francis J. García <contacto@francisjgarcia.es>" \
      description="Personal landing page - dev mode" \
      org.opencontainers.image.source="https://github.com/francisjgarcia/francisjgarcia.es"

RUN adduser -D -u 1001 app

WORKDIR /app

ENV PORT=3000

COPY --from=deps --chown=app:app /app/node_modules node_modules

# Source is mounted as a volume in dev, but copy for fallback
COPY --chown=app:app src src
COPY --chown=app:app public public

USER app

EXPOSE 3000

# --watch restarts on file changes (Node 23+)
CMD ["node", "--watch", "src/server.js"]
