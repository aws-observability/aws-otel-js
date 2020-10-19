/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

'use strict'

const { BasicTracerProvider, SimpleSpanProcessor, ConsoleSpanExporter } = require("@opentelemetry/tracing");
const { NodeTracerProvider } = require('@opentelemetry/node');
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector');

const { AWSXRayPropagator } = require('AWSXRayPropagator');
const { AwsXRayIdGenerator } = require('AWSXRayIdGenerator');

const { context, propagation, trace } = require("@opentelemetry/api");
const { awsEc2Detector } = require('@opentelemetry/resource-detector-aws');
const { detectResources } = require('@opentelemetry/resources/build/src/platform/node/detect-resources');

module.exports = (serviceName) => {
  // set global propagator
  propagation.setGlobalPropagator(new AWSXRayPropagator());
  
  var resources;
  detectResources({ detectors: [awsEc2Detector] })
  .then((res) => {
    resources = res;
    console.log("detected resource: " + JSON.stringify(resources));
  })
    .catch((e) => {console.log(e);});

  // create a provider for activating and tracking with AWS IdGenerator
  const tracerConfig = {
    idGenerator: new AwsXRayIdGenerator(),
    resources: resources
  };
  const tracerProvider = new NodeTracerProvider(tracerConfig);

  // add OTLP exporter
  const otlpExporter = new CollectorTraceExporter({
    serviceName: serviceName,
    protocolNode: 2,
  });
  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));
  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

  // Register the tracer
  tracerProvider.register();

  // Return an tracer instance
  return trace.getTracer("awsxray-tests");
}
