# Stage 1: Build Frontend Assets
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies including devDependencies for build
RUN npm install --legacy-peer-deps

# Copy full application source code
COPY . .

# Build production bundle into dist/
RUN npm run build

# Stage 2: Production Server Runtime (OpenShift hardened)
FROM node:20-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

# Copy dependency manifests and install production-only dependencies
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps && npm cache clean --force

# Copy built assets and server entrypoint
COPY --from=builder /app/dist ./dist
COPY server.js ./

# OpenShift arbitrary non-root UID permissions (UID 1001, root group 0)
RUN chown -R 1001:0 /app && chmod -R g+rwX /app

EXPOSE 8080

USER 1001

CMD ["node", "server.js"]
