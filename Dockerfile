# FROM node:18.13.0-alpine
FROM node:18.13.0

WORKDIR /app

EXPOSE 5000

COPY package.json yarn.lock ./

RUN yarn install --production=true

COPY . .

CMD ["yarn", "start:prod"]