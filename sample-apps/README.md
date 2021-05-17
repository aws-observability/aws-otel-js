# ADOT JavaScript Sample App

A simple HTTP server that demonstrates OpenTelemetry instrumentation for JavaScript apps

## Prerequisites

* [NPM and Node.js](https://nodejs.org/en/download/) installed.
* [ADOT Collector](https://aws-otel.github.io/docs/getting-started/collector) running in your environment

## Getting Started

Run the following commands to start the sample app:

```bash
git clone https://github.com/aws-observability/aws-otel-js.git
cd aws-otel-js/sample-apps
npm install
npm rb
export LISTEN_ADDRESS=localhost:8080
node server.js
```

## Using the sample app

The sample app exposes the following routes. Visit them in your browser, then go to the AWS X-Ray console to see the traces they generate.

* localhost:8080/ - healthcheck endpoint, generates a single span
* localhost:8080/aws-sdk-call - Makes a traced request with the AWS SDK
* localhost:8080/outgoing-http-call - Makes a traced downstream HTTP request

