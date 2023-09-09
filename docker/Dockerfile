FROM node:18-alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
USER node
WORKDIR /usr/src/app

FROM base as migrations
RUN pnpm install kysely dotenv pg ts-node @types/pg
COPY --chown=node:node run-migrations.ts ./
COPY --chown=node:node migrations ./migrations
CMD ["./node_modules/.bin/ts-node", "./run-migrations.ts"]

FROM base as setup
COPY --chown=node:node package.json pnpm-lock.yaml tsconfig*.json jest-e2e.config.json jest.config.json ./
RUN npm pkg delete scripts.prepare && pnpm install --frozen-lockfile
COPY --chown=node:node src ./src

FROM setup as prod-build
RUN pnpm build && pnpm prune --prod

FROM base as prod
COPY --chown=node:node --from=prod-build /usr/src/app/dist ./dist
COPY --chown=node:node --from=prod-build /usr/src/app/node_modules ./node_modules
CMD ["node", "dist/main"]

