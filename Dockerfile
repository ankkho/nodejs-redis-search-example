FROM node:lts-slim
WORKDIR /search-widget-backend

COPY . /search-widget-backend
COPY nginx/default /etc/nginx/sites-available/

RUN yarn install --frozen-lockfile --production && yarn cache clean \
    apt-get install nginx -y \
    service nginx start

EXPOSE 3000

RUN yarn add typescript && yarn build

CMD [ "yarn", "start" ]
