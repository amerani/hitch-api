FROM node:latest

WORKDIR /home/node/app

COPY . /home/node/app

RUN npm install -g typescript

RUN npm install -g ts-node

RUN npm install

EXPOSE 80

CMD [ "npm", "run", "serve" ]