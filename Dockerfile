FROM node:lts-slim
WORKDIR /nodejs-redis-search-example

COPY . /nodejs-redis-search-example
COPY nginx/default /etc/nginx/sites-available/

RUN yarn install --frozen-lockfile && yarn cache clean \
    apt-get install nginx -y \
    service nginx start

EXPOSE 3000