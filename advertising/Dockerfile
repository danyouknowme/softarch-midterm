FROM node:10.15.2-alpine

WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

CMD npm config set cache-min 9999999 && \
  npm install && \
  npm run start:dev
