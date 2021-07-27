'use strict';

// OTel JS - API
// const { DiagConsoleLogger, DiagLogLevel, diag } = require('@opentelemetry/api');
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const { CollectorMetricExporter } = require('@opentelemetry/exporter-collector-grpc');
const { MeterProvider } = require('@opentelemetry/metrics');
const { Resource } = require('@opentelemetry/resources');
const { ResourceAttributes } = require('@opentelemetry/semantic-conventions')

/** The OTLP Metrics Provider with OTLP gRPC Metric Exporter and Metrics collection Interval  */
module.exports = new MeterProvider({
    resource: Resource.default().merge(new Resource({
      [ResourceAttributes.SERVICE_NAME]: "aws-otel-integ-test"
    })),
    exporter: new CollectorMetricExporter(),
    interval: 1000,
}).getMeter('aws-otel');
