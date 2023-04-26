FROM node:lts
ENV APP_PORT=
ENV NODE_ENV=production
ENV NPM_REGISTRY=https://registry.npmjs.org/
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm --registry=${NPM_REGISTRY} install
COPY . .
RUN npm build
EXPOSE ${APP_PORT}
CMD ["node", "dist/index.bundle.js"]
