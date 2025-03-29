# FROM node:22.14.0-alpine3.21
FROM brayand/fullstack-project-template-frontend:1.0.0 

COPY . /app

WORKDIR /app

RUN npm install

RUN npm run build
