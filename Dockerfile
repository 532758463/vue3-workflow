FROM node:lts-alpine3.18 as build-stage
COPY ./ /app
WORKDIR /app
RUN npm install -g npm@10.2.4
RUN npm install --registry https://registry.npm.taobao.org && npm run build

FROM nginx
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf