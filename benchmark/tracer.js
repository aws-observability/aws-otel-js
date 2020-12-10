'use strict';

const benchmark = require('./benchmark');
const { NoopLogger, AlwaysOnSampler, AlwaysOffSampler } = require('@opentelemetry/core');
const { BatchSpanProcessor, InMemorySpanExporter, SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { NodeTracerProvider } = require('@opentelemetry/node')

const logger = new NoopLogger();

const setups = [
  {
    name: 'NodeTracerProviderNotSampled',
    provider: new NodeTracerProvider({ logger, sampler: new AlwaysOffSampler() })
  },
  {
    name: 'NodeTracerProviderSampled',
    provider: new NodeTracerProvider({ logger, sampler: new AlwaysOnSampler() })
  },
  {
    name: 'NodeTracerProvider with SimpleSpanProcessor',
    provider: getProvider(new SimpleSpanProcessor(new InMemorySpanExporter()))
  },
  {
    name: 'NodeTracerProvider with BatchSpanProcessor',
    provider: getProvider(new BatchSpanProcessor(new InMemorySpanExporter()))
  }
];

for (const setup of setups) {
  console.log(`Beginning ${setup.name} Benchmark...`);
  const tracer = setup.provider.getTracer("benchmark");
  const suite = benchmark(20)
    .add('#startSpan', function () {
      const span = tracer.startSpan('op');
      span.end();
    })
    .add('#getCurrentSpan', function () {
        const span = tracer.startSpan('op');
        tracer.getCurrentSpan();
        span.end();
      })
    .add('#startSpan:parent', function () {
      const span = tracer.startSpan('op');
      const childSpan = tracer.startSpan('client-op', { parent: span });
      childSpan.end();
      span.end();
    })
    .add('#startSpan with attribute', function () {
      const span = tracer.startSpan('op');
      for (let i = 0; i < 10; i++) {
        span.setAttribute('attr-key-' + i, 'attr-value-' + i);
      }
      span.end();
    })

  // run async
  suite.run({ async: false });
}
function getProvider(processor) {
  const provider = new NodeTracerProvider({ logger });
  provider.addSpanProcessor(processor);
  return provider;
}
