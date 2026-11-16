FROM node:20-bookworm-slim

WORKDIR /opt/app

# Install build dependencies for native modules (better-sqlite3)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first for layer caching
COPY package.json package-lock.json ./

# Install dependencies (npm ci with npm install fallback to ensure resilience)
RUN npm ci || npm install

# Copy source code
COPY . .

# Build Strapi admin panel
ENV NODE_ENV=production
RUN npm run build

# Runtime environment
ENV HOST=0.0.0.0
ENV PORT=1337

EXPOSE 1337

CMD ["npm", "run", "start"]
