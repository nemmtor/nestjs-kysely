FROM node:18.15-alpine as dev
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY tsconfig*.json jest-e2e.config.json jest.config.json ./
COPY src ./src
CMD ["pnpm", "test:e2e"]

