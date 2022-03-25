FROM node:alpine as build

WORKDIR /mnt
COPY package.json yarn.lock ./
RUN yarn

COPY snowpack.config.json ./
COPY snowpack/index.js ./snowpack/

RUN yarn build

FROM shurco/nginx-push-stream-module

COPY --from=build /mnt/snowpack/build/index.js /var/www/html/snowpack/build/index.js
COPY . /var/www/html
