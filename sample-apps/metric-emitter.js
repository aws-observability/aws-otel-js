'use strict';

// OTel JS - API
// const { DiagConsoleLogger, DiagLogLevel, diag } = require('@opentelemetry/api');
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const { CollectorMetricExporter } = require('@opentelemetry/exporter-collector-grpc');
const { MeterProvider } = require('@opentelemetry/metrics');
const { Resource } = require('@opentelemetry/resources');
const { ResourceAttributes } = require('@opentelemetry/semantic-conventions')

const API_COUNTER_METRIC = 'apiBytesSent';
const API_LATENCY_METRIC = 'latency';

/** The OTLP Metrics Provider with OTLP gRPC Metric Exporter and Metrics collection Interval  */
const meter = new MeterProvider({
    resource: Resource.default().merge(new Resource({
      [ResourceAttributes.SERVICE_NAME]: "aws-otel-integ-test"
    })),
    exporter: new CollectorMetricExporter(),
    interval: 1000,
}).getMeter('aws-otel');

/**  grabs instanceId and append to metric name to check individual metric for integration test */
var latencyMetricName = API_LATENCY_METRIC;
var apiBytesSentMetricName = API_COUNTER_METRIC;
const instanceId = process.env.INSTANCE_ID ? process.env.INSTANCE_ID.trimEnd() : "dummy-id";
const instanceIdSuffix = '_' + instanceId;
latencyMetricName += instanceIdSuffix;
apiBytesSentMetricName += instanceIdSuffix;

/** Counter Metrics */
const payloadMetric = meter.createCounter(apiBytesSentMetricName, {
    description: 'Metric for counting request payload size',
});

/** Value Recorder Metrics with Histogram */
const requestLatency = meter.createValueRecorder(latencyMetricName, {
    description: 'Metric for record request latency'
});

//** binds request latency metric with returnTime */
function emitReturnTimeMetric(returnTime, apiName, statusCode) {
    console.log('emit metric with return time ' + returnTime + ', ' + apiName + ', ' + statusCode);
    const labels = { 'apiName': apiName, 'statusCode': statusCode };
    requestLatency.bind(labels).record(returnTime);
}

//** emitsPayLoadMetrics() Binds payload Metric with number of bytes */
function emitsPayloadMetric(bytes, apiName, statusCode) {
    console.log('emit metric with http request size ' + bytes + ' byte, ' + apiName);
    const labels = { 'apiName': apiName, 'statusCode': statusCode };
    payloadMetric.bind(labels).add(bytes);
}

module.exports = {
    emitReturnTimeMetric,
    emitsPayloadMetric
}
