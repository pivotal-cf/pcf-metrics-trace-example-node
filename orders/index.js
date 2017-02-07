import express from 'express';
import PaymentsApi from './payments_api';

export default function(log) {
  const app = express();

  app.get('/process-order', async (req, res) => {
    log.info('/process-order called');
    try {
      const text = await PaymentsApi.chargeCard();
      res.status(200).send(text);
    } catch(e) {
      res.status(503).send(e.response.text);
    }
  });

  return app;
}