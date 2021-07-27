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

// OTel JS - API
const { DiagConsoleLogger, DiagLogLevel, diag, trace } = require('@opentelemetry/api');

// OTel JS - Core
const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/tracing');
const { NodeTracerProvider } = require('@opentelemetry/node');

// OTel JS - Core - Exporters
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector-grpc');

// OTel JS - Core - Instrumentations
const { Resource } = require('@opentelemetry/resources');
const { ResourceAttributes } = require('@opentelemetry/semantic-conventions')
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { AwsInstrumentation } = require('opentelemetry-instrumentation-aws-sdk');

// OTel JS - Contrib - AWS X-Ray
const { AWSXRayPropagator } = require('@opentelemetry/propagator-aws-xray');
const { AWSXRayIdGenerator } = require('@opentelemetry/id-generator-aws-xray');


module.exports = () => {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

  const tracerProvider = new NodeTracerProvider({
    resource: Resource.default().merge(new Resource({
      [ResourceAttributes.SERVICE_NAME]: "AWS OTel JS Sample HTTP App"
    })),
    idGenerator: new AWSXRayIdGenerator(),
  });

  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new CollectorTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? "localhost:4317"
  })
  ));

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

  return trace.getTracer("awsxray-tests");
}
