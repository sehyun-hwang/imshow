FROM node:alpine

WORKDIR /mnt
COPY --from=node-utils /mnt/utils utils
COPY package.json yarn.lock ./

RUN yarn add link:./utils

COPY index.js ./

LABEL express.route=/imshow
CMD ["node", "node_modules/utils/Express.js", "index.js"]