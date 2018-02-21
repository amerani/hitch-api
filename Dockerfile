FROM node:alpine

WORKDIR /home/node/app

COPY . /home/node/app

RUN npm install -g ts-node

RUN npm install

EXPOSE 8080

CMD [ "npm", "run", "serve" ]