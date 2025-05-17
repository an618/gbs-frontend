
FROM node:22-alpine3.20 AS build

ARG ENVIRONMENT="production"

WORKDIR /app

COPY package*.json ./

RUN npm add

COPY . .

RUN npm install -g @angular/cli

RUN ng build --configuration $ENVIRONMENT 

FROM nginx:alpine

COPY --from=build /app/dist/goalbase/browser /usr/share/nginx/html/goalbase/browser

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
