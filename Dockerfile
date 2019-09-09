FROM alpine
LABEL maintainer=julius.hietala@gmail.com
RUN apk add --update nodejs nodejs-npm
COPY . /src
WORKDIR /src
RUN npm install -g yarn
RUN yarn deps
RUN yarn build-frontend
EXPOSE 3000
CMD ["yarn", "start"]