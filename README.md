[![Build Status](https://travis-ci.org/pivotal-cf/pcf-metrics-trace-example-node.svg?branch=master)](https://travis-ci.org/pivotal-cf/pcf-metrics-trace-example-node)

# PCF Metrics Node Tracer Example

This is a nodejs repository with three apps: shopping-cart, orders, and payments.
These apps use [Zipkin](https://github.com/openzipkin/zipkin-js) to trace the calls between them. The traces can then be viewed in PCF-Metrics.

## Creating your own tracer apps

Most of the app code is standard nodejs application code independent of tracing.

To add tracing the following steps are neccesary:

- add the zipkin js express middleware
```
import express from 'express'
import {expressMiddleware as zipkin} from 'zipkin-instrumentation-express';

const app = new Express();

const ctxImpl = new ExplicitContext();
const recorder = new ConsoleRecorder();
const tracer = new Tracer({ctxImpl, recorder});

app.use(zipkin({tracer, serviceName: 'my service'}));
```
- instrument http requests that use fetch. Install and use [zipkin-instrumentation-fetch](https://github.com/openzipkin/zipkin-js/tree/master/packages/zipkin-instrumentation-fetch).

Parent Span Id will show up in the router logs even without this property.

## Using the example apps

### DEPLOY
To use the script, you must login as a user that has the ability to assign space permissions and make spaces.
It will create a given shopping-cart, orders, and payments app that can be used to preview an example trace.

To deploy, use the script `./scripts/deploy.sh`.
Set the `SUFFIX` ENV var to a unique identifier for your tracer applications.

#### For example
```
cf login
SUFFIX=test ./scripts/deploy.sh
```

### CURL APPS
Curl the `/checkout` endpoint for the given shopping cart app.

#### For example
```
curl shopping-cart-test.cfapps.io/checkout
```

### CLEANUP

To cleanup, use the script `./scripts/cleanup.sh`.
Set the `SUFFIX` ENV var to the same identifier used for deployment.

#### For example
```
cf login
SUFFIX=test ./scripts/cleanup.sh
```

### Viewing in PCF-Metrics

To view the trace in PCF-Metrics, go to the shopping-cart app in PCF-Metrics.
Find the log corresponding to the /checkout endpoint and click the 'View in Trace Explorer' icon.

#### For example
![metrics-trace-example](metrics-trace-example.png)