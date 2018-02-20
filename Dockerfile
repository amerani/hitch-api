FROM node:alpine

ENV NODE_ENV=docker

WORKDIR /home/node/app

COPY . /home/node/app

RUN npm install

EXPOSE 3000

CMD [ "./initDb.sh", "&&", "npm", "run", "serve" ]