FROM node:alpine

MAINTAINER kupiecart@gmail.com

WORKDIR /home/server
COPY . /home/server

RUN yarn install --ignore-optional
RUN yarn build
RUN mv build /home/serverus
RUN rm -r /home/server

WORKDIR /home/serverus
RUN yarn install --prod

ENV NODE_ENV docker
CMD node index.js
#CMD sh
