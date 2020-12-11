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
const tracer = require('./tracer')('aws-otel-integ-test');
const http = require('http');
const AWS = require('aws-sdk');
const meter = require('./metric-emitter');

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
  const requestStartTime = new Date().getMilliseconds();
  // start recording a time for request
  try {
    if (url === '/') {
      res.end('healthcheck');
    }

    if (url === '/aws-sdk-call') {
      const s3 = new AWS.S3();
      s3.listBuckets(() => { });
      const traceID = returnTraceIdJson();
      res.end(traceID);
    }

    if (url === '/outgoing-http-call') {
      http.get('http://aws.amazon.com');
      const traceID = returnTraceIdJson();
      res.end(traceID);
      meter.emitsPayloadMetric(res._contentLength + mimicPayLoadSize(), '/outgoing-http-call', res.statusCode);
      meter.emitReturnTimeMetric(new Date().getMilliseconds() - requestStartTime, '/outgoing-http-call', res.statusCode);
    }
  } catch (err) {
    console.error(err);
  }
}

//returns a traceId in X-Ray JSON format
function returnTraceIdJson() {
  const traceId = tracer.getCurrentSpan().context().traceId;
  const xrayTraceId = "1-" + traceId.substring(0, 8) + "-" + traceId.substring(8);
  const traceIdJson = JSON.stringify({ "traceId": xrayTraceId });
  return traceIdJson;
}

//returns random payload size
function mimicPayLoadSize() {
  return Math.random() * 1000;
}

startServer(process.env.LISTEN_ADDRESS);
