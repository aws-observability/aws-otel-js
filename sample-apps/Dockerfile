FROM node:14

WORKDIR /usr/src/app

COPY . .

RUN cd sample-apps && npm install && cd node_modules/AWSXRayIdGenerator && npm install && npm run compile && cd ../AWSXRayPropagator && npm install && npm run  compile

CMD ["node", "sample-apps/server.js" ]
