FROM node:alpine as build

WORKDIR /mnt
COPY package.json yarn.lock ./
RUN yarn

COPY snowpack.config.json snowpack/index.js ./

RUN yarn build

FROM shurco/nginx-push-stream-module

COPY . /var/www/html
COPY --from=build /mnt/snowpack /var/www/html/snowpack