FROM node:20.18.0-alpine3.20

USER node
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY public/ ./public
COPY views/ ./views
COPY src/ ./src

CMD [ "npm", "start" ]
