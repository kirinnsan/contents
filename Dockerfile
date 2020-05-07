FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

EXPOSE 5858

CMD [ "node", "app.js" ]