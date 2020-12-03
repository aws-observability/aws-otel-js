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
const tracer = require('./tracer')('');
// eslint-disable-next-line import/order
const http = require('http');
<<<<<<< HEAD
<<<<<<< HEAD
const https = require('https');
const fs = require('fs');
// const requests = require('requests');
const AWS = require('aws-sdk');
const meter = require('./metric-emitter');
=======
=======
const https = require('https');
const fs = require('fs');
>>>>>>> 6bc54af... chore: update endpoints of integration apps and include aws js sdk tracing
const request = require('request');
const AWS = require('aws-sdk');
>>>>>>> 9aa89c8... feat: update tracing calls to aws in integration

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
<<<<<<< HEAD
<<<<<<< HEAD
function handleRequest(req, res) {  
  const url = req.url;
  const requestStartTime = new Date().getMilliseconds();
  // start recording a time for request
=======
function handleRequest(req, res) {
=======
function handleRequest(req, res) {  
>>>>>>> 9aa89c8... feat: update tracing calls to aws in integration
  const url = req.url;
>>>>>>> eeb24ea... feat: add metrics path
  try { 
    if (url === '/') {
      res.end('healthcheck');
    }
    if (url === '/aws-sdk-call') {
<<<<<<< HEAD
<<<<<<< HEAD
      const s3 = new AWS.S3();
      s3.listBuckets(() => {});
      const traceID = returnTraceIdJson();
      res.end(traceID);
    }
    
    if (url === '/outgoing-http-call') {
      https.get('https://aws.amazon.com');
      const traceID = returnTraceIdJson();
      res.end(traceID);

      meter.emitsPayloadMetric(res._contentLength + mimicPayLoadSize(), '/outgoing-http-call', res.statusCode);
      meter.emitReturnTimeMetric(new Date().getMilliseconds() - requestStartTime, '/outgoing-http-call', res.statusCode);
    }
  } catch (err) {
      console.error(err)
  }
}

//returns a traceId in X-Ray JSON format
=======
      const body = [];
      req.on('error', (err) => console.log(err));
      req.on('data', (chunk) => body.push(chunk));
      const traceID = returnTraceIdJson()
      req.on('end', () => {
        res.end(traceID);
      }, 2000);
=======
      const s3 = new AWS.S3();
      s3.listBuckets(() => {});
      const traceID = returnTraceIdJson();
      res.end(traceID);
>>>>>>> 9aa89c8... feat: update tracing calls to aws in integration
    }

    if (url === '/outgoing-http-call') {
      // const options = {
      //   key: fs.readFileSync('./server-key.pem'),
      //   cert: fs.readFileSync('./server-cert.pem'),
      // };
      // require('./metrics');
      request.get('https://aws.amazon.com');
      const traceID = returnTraceIdJson();
      res.end(traceID);
    }
  } catch (err) {
      console.error(err)
  }
}

>>>>>>> eeb24ea... feat: add metrics path
function returnTraceIdJson() {
  const traceId = tracer.getCurrentSpan().context().traceId;
  const xrayTraceId = "1-" + traceId.substring(0, 8) + "-" + traceId.substring(8);
  const traceIdJson = JSON.stringify({ "traceId" : xrayTraceId });
  return traceIdJson;
<<<<<<< HEAD
}

//returns random payload size
function mimicPayLoadSize() {
  return Math.random() * 1000;
=======
>>>>>>> eeb24ea... feat: add metrics path
}

<<<<<<< HEAD
startServer("localhost:8080");
=======
startServer("localhost:8080");
>>>>>>> 9aa89c8... feat: update tracing calls to aws in integration
