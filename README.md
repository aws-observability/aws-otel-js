# AWS Distro for OpenTelemetry JavaScript Language

## Introduction

This repo hosts documentation and sample apps for the ADOT JavaScript library which provides the AWS service integrations for traces and metrics for the [OpenTelemetry JavaScript](https://github.com/open-telemetry/opentelemetry-js) library. The library can be configured to support trace applications with the AWS X-Ray service.

Check out the upstream project for documentation on the underlying features, APIs, and additional libraries. This repository only contains a small portion of components which will allow the OpenTelemetry JavaScript SDK to work with AWS X-Ray. The OpenTelemetry repository contains the rest. Note that ADOT is in preview for JavaScript metrics.

We provided an ID generator and propagator, which can be configured from the OpenTelemetry upstream API. The telemetry data generated can be exported in a variety of formats and can be configured via command lines or environment variables. The aim of this project is to be able to gather telemetry data from a JavaScript application, propagate the AWS X-Ray trace header, and export trace data to the AWS X-Ray backend using the [AWS Distro for OpenTelemetry Collector](https://github.com/aws-observability/aws-otel-collector).

## Getting Started

Check out the [getting started documentation](https://aws-otel.github.io/docs/getting-started/javascript-sdk).

## Sample Application (DEPRECATED)

**WARNING:** The sample app in this repository is deprecated and is no longer maintained.  Please use the [new standardized sample apps](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps).

## Supported Runtimes

For the complete list of supported runtimes, please refer to the upstream documentation [here](https://github.com/open-telemetry/opentelemetry-js/blob/master/README.md#supported-runtimes)

## How it works

The [OpenTelemetry JavaScript SDK](https://github.com/open-telemetry/opentelemetry-js) provides entry points with methods used for configuring vendor-specific aspects through its [API](https://www.npmjs.com/package/@opentelemetry/api). This custom configuration allows us to generate trace IDs which are compliant with the [X-Ray Trace ID format](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sendingdata.html#xray-api-traceids). In addition, we are also able to use a custom propagator which is passed into the tracer provider to conform to AWS X-Ray headers.

## Useful links

For more information on OpenTelemetry, visit: https://opentelemetry.io/

## Security issue notifications
If you discover a potential security issue in this project we ask that you notify AWS/Amazon Security via our [vulnerability reporting page](http://aws.amazon.com/security/vulnerability-reporting/). Please do **not** create a public github issue.


## License

This project is licensed under the Apache-2.0 License.
