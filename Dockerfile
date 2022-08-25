FROM node:17.8

WORKDIR /app

COPY  package*.json ./

RUN npm install

COPY . .

ENV port=3700

EXPOSE 3700

CMD [ "npm", "start" ]