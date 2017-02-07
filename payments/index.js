import express from 'express';

export default function(log) {
  const app = express();

  app.get('/charge-card', (req, res) => {
    log.info('/charge-card called');
    res.status(200).send('card successfully charged!');
  });

  return app;
}