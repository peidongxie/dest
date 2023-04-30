FROM node:lts
ARG APP_PORT
ENV APP_PORT=${APP_PORT:-3002}
ARG NPM_REGISTRY
ENV NPM_REGISTRY=${NPM_REGISTRY:-https://registry.npmmirror.com/}
WORKDIR /usr/src/app
RUN corepack enable pnpm
COPY pnpm-lock.yaml ./
RUN pnpm fetch --registry=${NPM_REGISTRY}
COPY . .
RUN pnpm i --offline -r
RUN pnpm -F @dest-toolkit/grpc-* -F @dest-toolkit/http-* build
RUN pnpm -F @dest-toolkit/worker-node bundle:prod
EXPOSE ${APP_PORT}
ENV NODE_ENV=production
CMD ["node", "packages/worker-node/dist/index.bundle.js"]
