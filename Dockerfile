# syntax=docker/dockerfile:1

FROM node:18-alpine as base

RUN apk add --no-cache g++ make py3-pip libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 3000

FROM base as builder

COPY . .

RUN npm run build

FROM base as production

ENV NODE_ENV=production

RUN npm ci

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/public /app/public

CMD ["npm", "start"]

FROM base as dev

ENV NODE_ENV=development

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
