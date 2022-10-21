FROM node:18-alpine as node

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

#EXPOSE 3000

ENV REACT_APP_API_URL /backend
# ENV REACT_APP_GOOGLE_MAPS_API AIzaSyDtl6G7PcQN8aQIX6Hr1CS8y1IKvEnfRJY

RUN npm run build

FROM nginx:alpine

# setup NGNIX
COPY --from=node app/build /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/conf.d/default.conf