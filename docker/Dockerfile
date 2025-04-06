# === Build stage ===
FROM node:22-slim AS builder

WORKDIR /app

RUN corepack enable

RUN apt-get update && apt-get install -y \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock .yarnrc.yml .pnp.* ./
COPY .yarn/ .yarn/
COPY src/ ./src/
COPY tsconfig.json ./

RUN yarn install --immutable

RUN yarn build


# === Runtime stage ===
FROM node:22-slim AS runner

WORKDIR /app

RUN corepack enable

RUN apt-get update && apt-get install -y \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock .yarnrc.yml .pnp.* ./
COPY .yarn/ .yarn/
COPY --from=builder /app/dist/ ./dist/

RUN yarn workspaces focus --production

ENV NODE_ENV=production

CMD ["yarn", "start"]
