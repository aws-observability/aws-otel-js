'use strict';

const tracer = require('./tracer')('example-server');
// eslint-disable-next-line import/order
const http = require('http');

/** Starts a HTTP server that receives requests on sample server address. */
function startServer(address) {
  // Creates a server
  const server = http.createServer(handleRequest);
  // Starts the server
  const endpoint = address.split(':');
  server.listen(endpoint[1], endpoint[0], (err) => {
    if (err) {
      throw err;
    }
    console.log(`Node HTTP listening on ${address}`);
  });
}

/** A function which handles requests and send response. */
function handleRequest(request, response) {
  const currentSpan = tracer.getCurrentSpan();
  // display traceid in the terminal
  console.log(`traceid: ${currentSpan.context().traceId}`);
  const span = tracer.startSpan('handleRequest', {
    parent: currentSpan,
    kind: 1, // server
    attributes: { key: 'value' },
  });
  // Annotate our span to capture metadata about the operation
  span.addEvent('invoking handleRequest');
  try {
    const body = [];
    request.on('error', (err) => console.log(err));
    request.on('data', (chunk) => body.push(chunk));
    // const traceIdJson = returnTraceIdJson(span);
    request.on('end', () => {
      // deliberately sleeping to mock some action.
      setTimeout(() => {
        span.end();
        response.end(JSON.stringify(returnTraceIdJson(span)));
      }, 2000);
    });
  } catch (err) {
    console.error(err);
    span.end();
  }

  function returnTraceIdJson(span) {
    const traceId = span.context().traceId.toString();
    const xrayTraceId = "1-" + traceId.substring(0, 8) + "-" + traceId.substring(8);
    const traceIdJson = { "traceId" : xrayTraceId }
    return traceIdJson;
  }
}

startServer(process.env.LISTEN_ADDRESS);
