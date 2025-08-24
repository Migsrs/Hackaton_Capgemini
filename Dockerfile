# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.17.1

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache python3 py3-pip

COPY package*.json ./
COPY requirements.txt ./

RUN npm ci --omit=dev

RUN python3 -m venv .venv \
 && . .venv/bin/activate \
 && pip install --upgrade pip \
 && pip install -r requirements.txt

COPY . .

RUN npm i -g http-server && chmod +x ./start.sh

ENV NODE_ENV=production

EXPOSE 8080 3000

CMD ["./start.sh"]
