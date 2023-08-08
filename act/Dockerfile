FROM node:alpine

COPY --from=docker:cli /usr/local/bin/docker /usr/local/bin/
COPY --from=docker:cli /usr/local/bin/docker-compose /root/.docker/cli-plugins/

RUN apk add jq tar
