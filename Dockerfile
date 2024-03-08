ARG NODE_VERSION=20.8.1

FROM node:${NODE_VERSION}-alpine as base
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app
COPY entrypoint.sh /usr/src/app/entrypoint.sh
EXPOSE 3000

FROM base as dev
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base as prod
COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY . .
COPY .dev.env .env
CMD ["pnpm", "start"]
