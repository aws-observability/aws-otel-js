'use strict';

const benchmark = require('./benchmark');
const api = require('@opentelemetry/api');
const { ROOT_CONTEXT } = require('@opentelemetry/context-base');
const { AWSXRayPropagator } = require('../packages/opentelemetry-propagator-aws-xray/build/src');

const setups = [
  {
    name: 'AWSXRayPropagator',
    propagator: new AWSXRayPropagator(),
    injectCarrier: {},
    extractCarrier: {
      'traceid': 'd4cda95b652f4a1592b449d5929fda1b',
      'spanid': '6e0c63257de34c92',
      'traceflag': '1'
    }
  },
];

for (const setup of setups) {
  console.log(`Beginning ${setup.name} Benchmark...`);
  const propagator = setup.propagator;
  const suite = benchmark(100)
    .add('#Inject', function () {
      propagator.inject(
        api.setExtractedSpanContext(ROOT_CONTEXT, {
          traceId: 'd4cda95b652f4a1592b449d5929fda1b',
          spanId: '6e0c63257de34c92',
          traceFlags: '1'
        }), setup.injectCarrier, api.defaultTextMapSetter);
    })
    .add('#Extract', function () {
      propagator.extract(ROOT_CONTEXT, setup.extractCarrier, api.defaultTextMapGetter);
    });

  // run async
  suite.run({ async: false });
}
