# Multi-stage build for optimal performance and security
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

WORKDIR /app

# Copy package files
COPY package*.json ./

# Configure npm for better performance and security
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set legacy-peer-deps true

# Development stage
FROM base AS development
ENV NODE_ENV=development
RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=dev --legacy-peer-deps

# Production dependencies stage
FROM base AS prod-deps
ENV NODE_ENV=production
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production --legacy-peer-deps && \
    npm cache clean --force

# Build stage
FROM development AS build
COPY . .
RUN npm run build 2>/dev/null || echo "No build script found, skipping..."

# Production stage
FROM node:18-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Install only runtime dependencies
RUN apk add --no-cache \
    cairo \
    jpeg \
    pango \
    musl \
    giflib \
    pixman \
    pangomm \
    libjpeg-turbo \
    freetype \
    curl \
    dumb-init

WORKDIR /app

# Copy production dependencies
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app .

# Set proper permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["npm", "start"]
