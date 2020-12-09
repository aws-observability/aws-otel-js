# Benchmarks

## How to run

To run your benchmark, just:

```sh
npm i && npm run bench
```

## Results

### `v0.12.3` release

```text
Beginning AWSXRayIdGenerator Benchmark...
  2 tests completed.

  #GenerateTraceID x 1,227,089 ops/sec ±0.44% (100 runs sampled)
  #GenerateSpanID  x 3,647,861 ops/sec ±0.33% (100 runs sampled)


Beginning AWSXRayPropagator Benchmark...
  2 tests completed.

  #Inject  x 1,924,934 ops/sec ±0.46% (100 runs sampled)
  #Extract x 3,485,536 ops/sec ±0.90% (100 runs sampled)


Beginning NodeTracerProviderNotSampled Benchmark...
  4 tests completed.

  #startSpan                x 1,092,736 ops/sec ±1.16% (20 runs sampled)
  #getCurrentSpan           x 1,055,954 ops/sec ±0.62% (20 runs sampled)
  #startSpan:parent         x   546,233 ops/sec ±0.82% (20 runs sampled)
  #startSpan with attribute x 1,018,488 ops/sec ±3.50% (20 runs sampled)

Beginning NodeTracerProviderSampled Benchmark...
  4 tests completed.

  #startSpan                x 306,672 ops/sec ±3.23% (20 runs sampled)
  #getCurrentSpan           x 306,777 ops/sec ±2.53% (20 runs sampled)
  #startSpan:parent         x 155,974 ops/sec ±2.99% (20 runs sampled)
  #startSpan with attribute x 202,195 ops/sec ±1.96% (20 runs sampled)

Beginning NodeTracerProvider with SimpleSpanProcessor Benchmark...
  4 tests completed.

  #startSpan                x 183,117 ops/sec ±12.34% (20 runs sampled)
  #getCurrentSpan           x 202,716 ops/sec ±2.37% (20 runs sampled)
  #startSpan:parent         x  75,013 ops/sec ±18.24% (20 runs sampled)
  #startSpan with attribute x 125,429 ops/sec ±2.49% (20 runs sampled)

Beginning NodeTracerProvider with BatchSpanProcessor Benchmark...
  4 tests completed.

  #startSpan                x 202,925 ops/sec ±3.37% (20 runs sampled)
  #getCurrentSpan           x 194,441 ops/sec ±8.13% (20 runs sampled)
  #startSpan:parent         x 101,141 ops/sec ±4.82% (20 runs sampled)
  #startSpan with attribute x 135,987 ops/sec ±2.33% (20 runs sampled)
```
