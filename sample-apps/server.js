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

const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const my_meter = require('./create-a-meter');
const { emitsPayloadMetric, emitReturnTimeMetric } = require('./get-meter-emit-functions')(my_meter)

// NOTE: TracerProvider must be initialized before instrumented packages
// (i.e. 'aws-sdk' and 'http') are imported.
const my_tracer = require('./create-a-tracer');

const http = require('http');
const AWS = require('aws-sdk');

const api = require('@opentelemetry/api');

const shouldSampleAppLog = (process.env.SAMPLE_APP_LOG_LEVEL || "INFO") == "INFO"

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

function handleRequest(req, res) {
  const requestStartTime = new Date().getMilliseconds();
  try {
    if (req.url === '/') {
      if (shouldSampleAppLog) {
        console.log("Responding to /");
      }

      res.end('healthcheck');
    }

    else if (req.url === '/aws-sdk-call') {
      const s3 = new AWS.S3();
      s3.listBuckets(() => {
        if (shouldSampleAppLog) {
          console.log("Responding to /aws-sdk-call");
        }

        res.end(getTraceIdJson());
      });
    }

    else if (req.url === '/outgoing-http-call') {
      http.get('http://aws.amazon.com', () => {
        if (shouldSampleAppLog) {
          console.log("Responding to /outgoing-http-call");
        }

        res.end(getTraceIdJson());
        emitsPayloadMetric(res._contentLength + mimicPayLoadSize(), '/outgoing-http-call', res.statusCode);
        emitReturnTimeMetric(new Date().getMilliseconds() - requestStartTime, '/outgoing-http-call', res.statusCode);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

function getTraceIdJson() {
  const otelTraceId = api.trace.getSpan(api.context.active()).spanContext().traceId;
  const timestamp = otelTraceId.substring(0, 8);
  const randomNumber = otelTraceId.substring(8);
  const xrayTraceId = "1-" + timestamp + "-" + randomNumber;
  return JSON.stringify({ "traceId": xrayTraceId });
}

function mimicPayLoadSize() {
  return Math.random() * 1000;
}

startServer(process.env.LISTEN_ADDRESS);
