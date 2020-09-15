FROM nginx:alpine

RUN apk add --no-cache nodejs yarn
RUN yarn global add @beam-australia/react-env

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY .env docker-entrypoint.sh /var/
COPY /build /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["sh", "/var/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]