'use strict';

const benchmark = require('./benchmark');
const { MeterProvider, ConsoleMetricExporter } = require('@opentelemetry/metrics');
const { NoopLogger } = require('@opentelemetry/core')

const logger = new NoopLogger();

const setups = [
    {
        name: 'MetricProvider',
        provider: new MeterProvider({ })
    },
    {
        name: 'Metric Provider with ConsoleMetricExporter',
        provider: new MeterProvider({ exporter: new ConsoleMetricExporter(), interval: 1000 })
    }
];

for (const setup of setups) {
    console.log(`Beginning ${setup.name} Benchmark...`);
    const meter = setup.provider.getMeter('benchmark');
    const payload = meter.createCounter('payload');
    const request = meter.createUpDownCounter('activeRequest');
    const latency = meter.createValueRecorder('latency');

    const suite = benchmark(20)
        .add('#generatePayloadMetric', function () {
            payload.add(1);
        })
        .add('#generateRequestMetric', function () {
            request.add(Math.random() > 0.5 ? 1 : -1);
        })
        .add('#generateLatencyMetric', function () {
            latency.record(Math.random() * 1000);
        })

    // run async
    suite.run({ async: false });
}
