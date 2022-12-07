# Development build stage
FROM node:16.13.0 as development-build-stage

ENV NODE_ENV development

COPY . ./app

WORKDIR /app

EXPOSE 3000

RUN yarn install --frozen-lockfile
RUN yarn build
RUN yarn db:generate

CMD ["yarn", "dev"]

# Production build stage
FROM node:16.13.0 as production-build-stage

ENV NODE_ENV production

COPY --from=development-build-stage /app/node_modules /app/node_modules
COPY --from=development-build-stage /app/dist /app/dist
COPY --from=development-build-stage /app/package.json /app

WORKDIR /app

EXPOSE 3000

CMD ["yarn", "start"]
