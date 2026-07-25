# syntax=docker/dockerfile:1

FROM node:24-alpine

# --- OCI image metadata (https://github.com/opencontainers/image-spec) ---
# Populated at build time, e.g.:
#   docker build \
#     --build-arg BUILD_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ) \
#     --build-arg VCS_REF=$(git rev-parse --short HEAD) \
#     --build-arg VERSION=1.0.0 \
#     -t netgrif/podinfo:1.0.0 .
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION=1.0.0

LABEL org.opencontainers.image.title="podinfo" \
      org.opencontainers.image.description="Tiny zero-dependency Node.js app that displays Kubernetes pod info, for workshops and demos." \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.source="https://github.com/netgrif/podinfo" \
      org.opencontainers.image.licenses="Apache-2.0" \
      org.opencontainers.image.vendor="NETGRIF"

ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
COPY server.js ./

EXPOSE 8080

# Container-native health check, so `docker ps` / orchestrators outside
# Kubernetes can also see liveness without extra tooling.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1

# Run as a non-root user, a good habit to show in a workshop
USER node

CMD ["node", "server.js"]
