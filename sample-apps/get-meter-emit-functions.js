
const API_COUNTER_METRIC = 'apiBytesSent';
const API_LATENCY_METRIC = 'latency';

module.exports = (meter) => {

    /**  grabs instanceId and append to metric name to check individual metric for integration test */
    const instanceId = process.env.INSTANCE_ID ? process.env.INSTANCE_ID.trim() : "dummy-id";
    const instanceIdSuffix = '_' + instanceId;
    const latencyMetricName = API_LATENCY_METRIC + instanceIdSuffix;
    const apiBytesSentMetricName = API_COUNTER_METRIC + instanceIdSuffix;
    
    /** Counter Metrics */
    const payloadMetric = meter.createCounter(apiBytesSentMetricName, {
        description: 'Metric for counting request payload size',
    });
    
    /** Value Recorder Metrics with Histogram */
    const requestLatency = meter.createValueRecorder(latencyMetricName, {
        description: 'Metric for record request latency'
    });
    
    //** emitsPayLoadMetrics() Binds payload Metric with number of bytes */
    function emitsPayloadMetric(bytes, apiName, statusCode) {
        const labels = { 'apiName': apiName, 'statusCode': statusCode };
        payloadMetric.bind(labels).add(bytes);
    }
    
    //** binds request latency metric with returnTime */
    function emitReturnTimeMetric(returnTime, apiName, statusCode) {
        const labels = { 'apiName': apiName, 'statusCode': statusCode };
        requestLatency.bind(labels).record(returnTime);
    }

    return {
        emitReturnTimeMetric,
        emitsPayloadMetric
    }
}
