# Benchmarks

## How to run

To run the benchmarks, run the following command:

```sh
npm i && npm run bench
```

## Results

### `v0.12.3` release

```text
Beginning MetricProvider Benchmark...
  3 tests completed.

  #generatePayloadMetric x 1,007,764 ops/sec ±1.85% (20 runs sampled)
  #generateRequestMetric x 1,001,661 ops/sec ±0.69% (20 runs sampled)
  #generateLatencyMetric x   998,286 ops/sec ±0.69% (20 runs sampled)

Beginning Metric Provider with ConsoleMetricExporter Benchmark...
  3 tests completed.

  #generatePayloadMetric x 929,668 ops/sec ±3.54% (20 runs sampled)
  #generateRequestMetric x 936,235 ops/sec ±0.70% (20 runs sampled)
  #generateLatencyMetric x 915,271 ops/sec ±0.71% (20 runs sampled)


Beginning AWSXRayIdGenerator Benchmark...
  2 tests completed.

  #GenerateTraceID x 1,205,111 ops/sec ±0.47% (100 runs sampled)
  #GenerateSpanID  x 3,633,887 ops/sec ±0.40% (100 runs sampled)


Beginning AWSXRayPropagator Benchmark...
  2 tests completed.

  #Inject  x 1,753,843 ops/sec ±1.62% (100 runs sampled)
  #Extract x 3,413,692 ops/sec ±0.90% (100 runs sampled)


Beginning NodeTracerProviderNotSampled Benchmark...
  4 tests completed.

  #startSpan                x 1,048,809 ops/sec ±3.96% (20 runs sampled)
  #getCurrentSpan           x 1,077,593 ops/sec ±1.40% (20 runs sampled)
  #startSpan:parent         x   540,407 ops/sec ±1.64% (20 runs sampled)
  #startSpan with attribute x 1,038,623 ops/sec ±2.67% (20 runs sampled)

Beginning NodeTracerProviderSampled Benchmark...
  4 tests completed.

  #startSpan                x 285,707 ops/sec ±3.36% (20 runs sampled)
  #getCurrentSpan           x 298,731 ops/sec ±1.69% (20 runs sampled)
  #startSpan:parent         x 146,681 ops/sec ±2.37% (20 runs sampled)
  #startSpan with attribute x 193,990 ops/sec ±2.25% (20 runs sampled)

Beginning NodeTracerProvider with SimpleSpanProcessor Benchmark...
  4 tests completed.

  #startSpan                x 167,702 ops/sec ±9.65% (20 runs sampled)
  #getCurrentSpan           x 191,007 ops/sec ±2.31% (20 runs sampled)
  #startSpan:parent         x  71,121 ops/sec ±25.73% (20 runs sampled)
  #startSpan with attribute x 127,803 ops/sec ±1.43% (20 runs sampled)

Beginning NodeTracerProvider with BatchSpanProcessor Benchmark...
  4 tests completed.

  #startSpan                x 224,222 ops/sec ±3.02% (20 runs sampled)
  #getCurrentSpan           x 218,535 ops/sec ±4.43% (20 runs sampled)
  #startSpan:parent         x 104,733 ops/sec ±3.01% (20 runs sampled)
  #startSpan with attribute x 138,022 ops/sec ±1.60% (20 runs sampled)
```
