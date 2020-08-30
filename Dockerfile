FROM node:alpine

MAINTAINER kupiecart@gmail.com

WORKDIR /home/server

COPY build /home/server

RUN yarn install --prod

ENV NODE_ENV docker
CMD node index.js
#CMD sh
