FROM node:14

WORKDIR /usr/src/app

COPY . ./

RUN ls

EXPOSE 8080

RUN cd integ-test/js-sdk-emitter

RUN npm install

CMD ["node", "integ-test/js-sdk-emitter/server.js" ]
