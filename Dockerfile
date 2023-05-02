FROM node:18.13.0-alpine

WORKDIR /app

EXPOSE 5000

COPY package*.json ./

RUN npm install

COPY . .