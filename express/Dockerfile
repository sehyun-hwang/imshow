FROM node:alpine

WORKDIR /mnt
COPY package.json pnpm-lock.yaml .npmrc ./

RUN --mount=type=secret,id=NODE_AUTH_TOKEN corepack enable pnpm \
    && NODE_AUTH_TOKEN=$(cat /run/secrets/NODE_AUTH_TOKEN) pnpm i -P --force --frozen-lockfile \
    && pnpm store prune

RUN echo '#!/bin/sh' > entrypoint.sh \
    && echo exec $(NODE_AUTH_TOKEN= pnpm which express | tee /dev/stderr) '$@' >> entrypoint.sh \
    && chmod +x entrypoint.sh

COPY index.js ./

LABEL express.route=/imshow \
      org.opencontainers.image.source=https://github.com/sehyun-hwang/imshow

EXPOSE 80
ENV PORT=80
ENTRYPOINT ["/mnt/entrypoint.sh"]
CMD ["index.js"]
