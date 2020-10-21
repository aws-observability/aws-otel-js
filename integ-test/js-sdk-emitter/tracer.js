'use strict'

const { BasicTracerProvider, SimpleSpanProcessor, ConsoleSpanExporter } = require("@opentelemetry/tracing");
const { NodeTracerProvider } = require('@opentelemetry/node');
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector-grpc');

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
    url: (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) ? process.env.OTEL_EXPORTER_OTLP_ENDPOINT : "localhost:55680"
  });
  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));
  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

  // Register the tracer
  tracerProvider.register();

  // Return an tracer instance
  return trace.getTracer("awsxray-tests");
}
