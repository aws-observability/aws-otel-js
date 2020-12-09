'use strict';

const benchmark = require('./benchmark');
const { AwsXRayIdGenerator } = require('../packages/opentelemetry-id-generator-aws-xray');


const setups = [
    {
        name: 'AWSXRayIdGenerator',
        idGenerator: new AwsXRayIdGenerator()
    },
];

for (const setup of setups) {
    console.log(`Beginning ${setup.name} Benchmark...`);
    const idGenerator = setup.idGenerator;
    const suite = benchmark(100)
      .add('#GenerateTraceID', function () {
        idGenerator.generateTraceId();
      })
      .add('#GenerateSpanID', function () {
        idGenerator.generateSpanId();
      });
  
    // run async
    suite.run({ async: false });
  }