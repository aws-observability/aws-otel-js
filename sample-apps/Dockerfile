FROM node:14

WORKDIR /usr/src/app

COPY . .

RUN ls

RUN cd sample-apps && npm install

RUN cd sample-apps/node_modules/AWSXRayPropagator && npm install && npm run compile

RUN cd sample-apps/node_modules/AWSXRayIdGenerator && npm install && npm run compile

CMD ["node", "sample-apps/server.js" ]
