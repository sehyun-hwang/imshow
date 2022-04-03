FROM node:alpine as build

WORKDIR /mnt
COPY package.json yarn.lock ./
RUN yarn

COPY snowpack.config.json ./
COPY snowpack/index.js snowpack/

RUN yarn build

FROM shurco/nginx-push-stream-module

COPY . /var/www/html
COPY --from=build /mnt/snowpack/build /var/www/html/snowpack/build

LABEL org.opencontainers.image.source https://github.com/sehyun-hwang/imshow