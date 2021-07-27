'use strict';

const { CollectorMetricExporter } = require('@opentelemetry/exporter-collector-grpc');
const { MeterProvider } = require('@opentelemetry/metrics');

/** The OTLP Metrics Provider with OTLP gRPC Metric Exporter and Metrics collection Interval  */
const meter = new MeterProvider({
  exporter: new CollectorMetricExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? "localhost:44317"
  }),
  interval: 1000,
}).getMeter('aws-otel-js');

/** Counter Metrics */
const payloadMetric = meter.createCounter('payload', {
  description: 'Metric for counting request payload size',
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
  payloadMetric.bind(labels).add(1);
  activeReqMetric.bind(labels).add(Math.random() > 0.5 ? 1 : -1);
  requestLatency.bind(labels).record(Math.random() * 1000)
}, 1000);
