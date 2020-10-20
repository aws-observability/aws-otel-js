# OpenTelemetry Propagator AWS Xray
[![Gitter chat][gitter-image]][gitter-url]
[![Apache License][license-image]][license-image]

The OpenTelemetry Propagator for AWS X-Ray provides HTTP header propagation for systems that are using AWS X-Ray HTTP header format. This propagator translates the OpenTelemetry SpanContext into the equivalent AWS X-Ray header format, for use with the OpenTelemetry JS SDK. 

### Installation

`
npm install --save @aws/otel-xray-propagator
`

### Usage

In the [global tracer configuration file](https://github.com/open-telemetry/opentelemetry-js/blob/master/getting-started/README.md#initialize-a-global-tracer), configure the following:

```js
const { propagation } = require("@opentelemetry/api");
const { AwsXRayPropagator } = require('@aws-observability/propagator-aws-xray');
// ...

module.exports = ("service_name_here") => {
  // set global propagator
  propagation.setGlobalPropagator(new AwsXRayPropagator());
  // ...}
```

For more details, see the Getting Started guide.

### Propagator Details

Example header:`X-Amzn-Trace-Id: Root=1-5759e988-bd862e3fe1be46a994272793;Parent=53995c3f42cd8ad8;Sampled=1`

The header consists of three parts: the root trace ID, the parent ID and the sampling decision. The root is required, whereas the parent ID and sampling decision are optional.

#### Root - The AWS X-Ray format trace ID

* Format: (spec-version)-(timestamp)-(UUID)
    * spec_version - The version of the AWS X-Ray header format. Currently, only "1" is valid.
    * timestamp - 32-bit number in base16 format, encoded from time(second) when created. Populated by taking the first 8 characters of the OpenTelemetry trace ID.
    * UUID - 96-bit random number in base16 format. Populated by taking the last 10 characters of the OpenTelemetry trace ID.

Root is analogous to the [OpenTelemetry Trace ID](https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/overview.md#spancontext), with some small format changes.
For additional reading, see the [AWS X-Ray Trace ID](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sendingdata.html#xray-api-traceids) public documentation.

#### Parent - The ID of the AWS X-Ray Segment

* 64-bit random number in base16 format. Populated from the [OpenTelemetry Span ID](https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/overview.md#spancontext).

#### Sampled - The sampling decision*

* Defined in the AWS X-Ray specification as a tri-state field, with "0", "1" and "?" as valid values. Only "0" and "1" are used in this propagator.
* Populated from the [OpenTelemetry trace flags](https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/overview.md#spancontext).

Example of usage (will be added after published):
### Useful links
- For more information on OpenTelemetry, visit: <https://opentelemetry.io/>
- For more about OpenTelemetry JavaScript: <https://github.com/open-telemetry/opentelemetry-js>
- For help or feedback on this project, join us on [gitter][gitter-url]

### License

Apache 2.0 - See [LICENSE][license-url] for more information.

[gitter-image]: https://badges.gitter.im/open-telemetry/opentelemetry-js.svg
[gitter-url]: https://gitter.im/open-telemetry/opentelemetry-node?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[license-url]: https://github.com/open-telemetry/opentelemetry-js-contrib/blob/master/LICENSE
[license-image]: https://img.shields.io/badge/license-Apache_2.0-green.svg?style=flat
