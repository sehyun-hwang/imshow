FROM node:alpine as build

WORKDIR /mnt
COPY package.json ./
RUN yarn

COPY esbuild esbuild
RUN yarn build

FROM shurco/nginx-push-stream-module

COPY index.html *.js /var/www/html/
COPY --from=build /mnt/esbuild/dist.js /var/www/html/esbuild/dist.js

LABEL org.opencontainers.image.source https://github.com/sehyun-hwang/imshow