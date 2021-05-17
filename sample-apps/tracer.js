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

'use strict'

const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/tracing');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector-grpc');

const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { AwsInstrumentation } = require('opentelemetry-instrumentation-aws-sdk');

const { AWSXRayPropagator } = require('@opentelemetry/propagator-aws-xray');
const { AWSXRayIdGenerator } = require('@opentelemetry/id-generator-aws-xray');

const { DiagConsoleLogger, DiagLogLevel, diag, trace } = require('@opentelemetry/api');

module.exports = (serviceName) => {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

  // create a provider for activating and tracking with AWS IdGenerator
  const tracerConfig = {
    idGenerator: new AWSXRayIdGenerator(),
  };
  const tracerProvider = new NodeTracerProvider(tracerConfig);

  // add OTLP exporter
  const otlpExporter = new CollectorTraceExporter({
    serviceName: serviceName,
    url: (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) ? process.env.OTEL_EXPORTER_OTLP_ENDPOINT : "localhost:55680"
  });
  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));
  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

  // Register the tracer with X-Ray propagator
  tracerProvider.register({
    propagator: new AWSXRayPropagator()
  });

  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation(),
      new AwsInstrumentation({
        suppressInternalInstrumentation: true
      }),
    ]
  });

  // Return a tracer instance
  return trace.getTracer("awsxray-tests");
}
