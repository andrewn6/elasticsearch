FROM node:14-alpine
WORKDIR /dev 
ADD . .
RUN yarn install
RUN yarn server:dev 