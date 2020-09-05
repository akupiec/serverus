FROM node:alpine

MAINTAINER kupiecart@gmail.com

WORKDIR /home/server
COPY . /home/server

#BE
RUN yarn install --ignore-optional && yarn build

#FE
WORKDIR /home/server/frontend
RUN yarn install && yarn build

RUN mv ../build /home/serverus \
    && rm -r /home/server

WORKDIR /home/serverus
RUN yarn install --prod

ENV NODE_ENV docker
CMD node index.js
#CMD sh
