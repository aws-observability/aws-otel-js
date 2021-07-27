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

const { emitsPayloadMetric, emitReturnTimeMetric } = require('./metric-emitter');
const initialize_aws_xray_tracer = require('./tracer');

// NOTE: TracerProvider must be initialized before instrumented packages (i.e.
// 'aws-sdk' and 'http') are imported.
initialize_aws_xray_tracer("hello");

const http = require('http');
const AWS = require('aws-sdk');

const api = require('@opentelemetry/api');

/** Starts an HTTP server that receives requests on sample server address. */
function startServer(address) {
  const [hostname, port] = address.split(':');
  const server = http.createServer(handleRequest);
  server.listen(port, hostname, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Node HTTP listening on ${address}`);
  });
}

/** A function which handles requests and send response. */
function handleRequest(req, res) {
  // Start recording time for request
  const requestStartTime = new Date().getMilliseconds();
  try {
    if (req.url === '/') {
      res.end('healthcheck');
    }

    else if (req.url === '/aws-sdk-call') {
      const s3 = new AWS.S3();
      const traceID = getTraceIdJson();
      s3.listBuckets(() => {
        res.end(traceID);
      });
    }

    else if (req.url === '/outgoing-http-call') {
      const traceID = getTraceIdJson();
      http.get('http://aws.amazon.com', () => {
        emitsPayloadMetric(res._contentLength + mimicPayLoadSize(), '/outgoing-http-call', res.statusCode);
        emitReturnTimeMetric(new Date().getMilliseconds() - requestStartTime, '/outgoing-http-call', res.statusCode);
        res.end(traceID);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

//returns a traceId in X-Ray JSON format
function getTraceIdJson() {
  const otelTraceId = api.trace.getSpan(api.context.active()).spanContext().traceId;
  const timestamp = otelTraceId.substring(0, 8);
  const randomNumber = otelTraceId.substring(8);
  const xrayTraceId = "1-" + timestamp + "-" + randomNumber;
  return JSON.stringify({ "traceId": xrayTraceId });
}

//returns random payload size
function mimicPayLoadSize() {
  return Math.random() * 1000;
}

startServer(process.env.LISTEN_ADDRESS);
