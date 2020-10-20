FROM node:14

WORKDIR /usr/src/app

COPY . .

RUN ls

RUN cd integ-test/js-sdk-emitter && npm install

RUN cd integ-test/js-sdk-emitter/node_modules/AWSXRayPropagator && npm install && npm run compile

RUN cd integ-test/js-sdk-emitter/node_modules/AWSXRayIdGenerator && npm install && npm run compile

CMD ["node", "integ-test/js-sdk-emitter/server.js" ]
