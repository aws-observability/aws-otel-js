'use strict';

const { ConsoleLogger, LogLevel } = require('@opentelemetry/core');
const { CollectorMetricExporter } = require('@opentelemetry/exporter-collector-grpc');
const { MeterProvider } = require('@opentelemetry/metrics');

/** The OTLP Metrics gRPC Collector */
const metricExporter = new CollectorMetricExporter({
  serviceName: 'aws-otel-js-sample',
  logger: new ConsoleLogger(LogLevel.DEBUG),
});

/** The OTLP Metrics Provider with OTLP gRPC Metric Exporter and Metrics collection Interval  */
const meter = new MeterProvider({
  exporter: metricExporter,
  interval: 1000,
}).getMeter('aws-otel-js');

/** Counter Metrics */
const playloadMetric = meter.createCounter('playload', {
  description: 'Metric for counting request playload size',
});

/** Up and Down Counter Metrics */
const activeReqMetric = meter.createUpDownCounter('activeRequest', {
  description: 'Metric for record active requests',
});

/** Value Recorder Metrics with Histogram */
const requestLatency = meter.createValueRecorder('latency', {
  description: 'Metric for record request latency',
});

/** Define Metrics Dimensions */
const labels = { pid: process.pid, env: 'beta' };

/** Send the defined metrics every seconds */
setInterval(() => {
  playloadMetric.bind(labels).add(1);
  activeReqMetric.bind(labels).add(Math.random() > 0.5 ? 1 : -1);
  requestLatency.bind(labels).record(Math.random() * 1000)
}, 1000);
