FROM node:14

WORKDIR /usr/src/app

COPY . .

RUN cd sample-apps && npm install

CMD ["node", "sample-apps/server.js" ]
