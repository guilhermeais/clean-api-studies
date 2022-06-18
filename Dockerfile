FROM node:16
WORKDIR /usr/src/clean-node-api
COPY package.json .
RUN npm i --silent --only=prod
COPY ./dist ./dist
EXPOSE 5000
CMD ["npm", "start"]