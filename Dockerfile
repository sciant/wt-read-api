FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .
ENV WT_CONFIG ropsten

CMD ["npm", "start"]

EXPOSE 3000
