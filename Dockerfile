FROM node:16
WORKDIR /usr/src/clean-node-api
COPY package.json .
RUN npm i --silent --only=prod