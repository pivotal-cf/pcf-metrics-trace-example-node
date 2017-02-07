import express from 'express';
import OrdersApi from './orders_api';
import {expressMiddleware as zipkin} from 'zipkin-instrumentation-express';

export default function(serviceName, log, tracer) {
  const app = express();

  app.use(zipkin({tracer, serviceName}));

  app.get('/checkout', async(req, res) => {
    log.info('/checkout called');
    try {
      const text = await OrdersApi.processOrder({tracer});
      res.status(200).send(text);
    } catch (e) {
      res.status(503).send(e.response.text);
    }
  });

  return app;
}