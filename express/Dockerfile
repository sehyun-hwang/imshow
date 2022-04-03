FROM node:alpine

WORKDIR /mnt
COPY package.json yarn.lock ./

RUN yarn add https://www.hwangsehyun.com/node/utils.tar.gz

COPY index.js ./

LABEL express.route=/imshow
LABEL org.opencontainers.image.source https://github.com/sehyun-hwang/imshow
CMD ["node", "node_modules/utils/Express.js", "index.js"]