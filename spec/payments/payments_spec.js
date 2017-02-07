import '../spec_helper';

describe('Payments', () => {
  let paymentsApp, request, log;

  beforeEach(() => {
    request = require('supertest');
    log = jasmine.createSpyObj('log', ['info']);
    paymentsApp = require('../../payments/index')(log);
  });

  describe('GET /charge-card', () => {
    let response;
    beforeEach.async(async () => {
      response = await request(paymentsApp).get('/charge-card');
    });

    it('returns 200', () => {
      expect(response.status).toBe(200);
    });

    it('returns the success message', () => {
      expect(response.text).toBe('card successfully charged!');
    });

    it('logs something', () => {
      expect(log.info).toHaveBeenCalledWith('/charge-card called');
    });
  });
});