import express from 'express';
import OrdersApi from './orders_api';

export default function(log) {
  const app = express();

  app.get('/checkout', async (req, res) => {
    log.info('/checkout called');
    try {
      const text = await OrdersApi.processOrder();
      res.status(200).send(text);
    } catch(e) {
      res.status(503).send(e.response.text);
    }
  });

  return app;
}