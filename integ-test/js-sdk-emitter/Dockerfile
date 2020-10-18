FROM node:14

WORKDIR /usr/src/app

COPY . ./

RUN ls

RUN cd integ-test/js-sdk-emitter

RUN npm install

CMD ["node", "integ-test/js-sdk-emitter/server.js" ]
