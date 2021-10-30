FROM node:14-alpine
WORKDIR /
ADD . .
RUN yarn install
RUN yarn server:dev 