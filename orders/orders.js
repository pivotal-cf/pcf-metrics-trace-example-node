import express from 'express';
import PaymentsApi from './payments_api';
import {expressMiddleware as zipkin} from 'zipkin-instrumentation-express';

export default function(serviceName, log, tracer) {
  const app = express();

  app.use(zipkin({tracer, serviceName}));

  app.get('/process-order', async(req, res) => {
    log.info('/process-order called');
    try {
      const text = await PaymentsApi.chargeCard({tracer});
      res.status(200).send(text);
    } catch (e) {
      res.status(503).send(e.response.text);
    }
  });

  return app;
}