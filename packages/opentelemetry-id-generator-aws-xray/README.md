# AWS OpenTelemetry X-Ray IdGenerator README

[![Gitter chat][gitter-image]][gitter-url]
[![Apache License][license-image]][license-image]

The OpenTelemetry IdGenerator for AWS X-Ray generates trace IDs with its first four bytes set to the start time of the trace followed by a unique identifier consisting of 12 bytes of randomly generated numbers. OpenTelemetry offers an extension point which allows the usage of this custom IdGenerator as opposed to the out-of-the-box random IdGenerator.

### Installation

`
npm install --save @aws/otel-xray-id-generator
`

### Usage

In the [global tracer configuration file](https://github.com/open-telemetry/opentelemetry-js/blob/master/getting-started/README.md#initialize-a-global-tracer), configure the following:

```js
const { NodeTracerProvider } = require('@opentelemetry/node');
const { AwsXRayIdGenerator } = require('@aws-observability/propagator-aws-xray');
// ...

module.exports = ("service_name_here") => {
   const tracerConfig = {
    idGenerator: new AwsXRayIdGenerator(),
    resources: resources
  };
  const tracerProvider = new NodeTracerProvider(tracerConfig);
  // ...}
```

For more details, see the Getting Started guide.

### Trace ID Details

Example trace ID format: 58406520a006649127e371903a2de979

A trace ID consists of two parts; the time stamp and the unique identifier.

#### Time Stamp

* the first 8 hexadecimal digits represent the time of the original request in Unix epoch time
* for example, 10:00AM December 1st, 2016 PST in epoch time is 1480615200 seconds, or 58406520 in hexadecimal digits.

#### Unique Identifier

* the last 24 hexadecimal digits is an unique identifier for the trace

### Useful links

* For more information on OpenTelemetry, visit: <https://opentelemetry.io/>
* For more about OpenTelemetry JavaScript: <https://github.com/open-telemetry/opentelemetry-js>
* For help or feedback on this project, join us on [gitter][gitter-url]

### License

Apache 2.0 - See [LICENSE][license-url] for more information.

[gitter-image]: https://badges.gitter.im/open-telemetry/opentelemetry-js.svg
[gitter-url]: https://gitter.im/open-telemetry/opentelemetry-node?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[license-url]: https://github.com/open-telemetry/opentelemetry-js-contrib/blob/master/LICENSE
[license-image]: https://img.shields.io/badge/license-Apache_2.0-green.svg?style=flat
