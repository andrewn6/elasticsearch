FROM node:14-alpine
WORKDIR /server
ADD . . 
RUN yarn install
RUN yarn server:build
CMD ["yarn", "server:start"]