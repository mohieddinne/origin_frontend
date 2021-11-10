# This file is a template, and might need editing before it works on your project.
FROM node:12-alpine AS builder

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

ARG node=dev
RUN ( echo "$node" | grep -Eq "^(dev|staging|master)$" ) && echo "$node" || node=dev; echo "$node"
RUN REACT_APP_ENV=$node npm run build

FROM httpd:2.4-alpine

WORKDIR /usr/local/apache2/htdocs/

COPY ./my-httpd.conf /usr/local/apache2/conf/httpd.conf

COPY --from=builder /usr/src/app/build/ /usr/local/apache2/htdocs/
