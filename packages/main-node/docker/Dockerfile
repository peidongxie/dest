FROM node:lts
ARG NPM_REGISTRY
WORKDIR /usr/src/app
RUN corepack prepare pnpm@8.5.0
RUN corepack enable pnpm
COPY pnpm-lock.yaml ./
RUN pnpm fetch --registry=${NPM_REGISTRY}
COPY . .
RUN pnpm i --offline -r --registry=${NPM_REGISTRY}
RUN pnpm -F @dest-toolkit/grpc-* -F @dest-toolkit/http-* build
RUN pnpm -F @dest-toolkit/main-node bundle:prod
EXPOSE ${APP_PORT}
ENV NODE_ENV=production
CMD ["node", "packages/main-node/dist/index.js"]
