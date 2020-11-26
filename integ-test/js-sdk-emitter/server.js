/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS'" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 */

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
function handleRequest(req, res) {
  const url = req.url;
  try { 
    if (url === '/') {
      res.end('healthcheck');
    }
    if (url === '/aws-sdk-call') {
      const body = [];
      req.on('error', (err) => console.log(err));
      req.on('data', (chunk) => body.push(chunk));
      const traceID = returnTraceIdJson()
      req.on('end', () => {
        res.end(traceID);
      }, 2000);
    }
    if (url === '/outgoing-http-call') {
      require('./metrics');
    }
  } catch (err) {
  console.error(err)
  }
}

function returnTraceIdJson() {
  const traceId = tracer.getCurrentSpan().context().traceId;
  const xrayTraceId = "1-" + traceId.substring(0, 8) + "-" + traceId.substring(8);
  const traceIdJson = JSON.stringify({ "traceId" : xrayTraceId });
  return traceIdJson;
}

startServer(process.env.LISTEN_ADDRESS);
