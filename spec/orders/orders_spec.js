import '../spec_helper';

describe('Orders', () => {
  let ordersApp, request, log;

  beforeEach(() => {
    request = require('supertest');
    log = jasmine.createSpyObj('log', ['info']);
    ordersApp = require('../../orders/index')(log);
  });

  describe('GET /process-order', () => {
    let PaymentsApi;
    beforeEach(() => {
      PaymentsApi = require('../../orders/payments_api');
    });

    describe('when chargeCard is not successful', () => {
      const text = 'some kind of error';
      let response;

      beforeEach.async(async () => {
        spyOn(PaymentsApi, 'chargeCard');
        PaymentsApi.chargeCard.and.callFake(() => Promise.reject({response: {status: 400, text}}));
        response = await request(ordersApp).get('/process-order');
      });

      it('returns 503', () => {
        expect(response.status).toBe(503);
      });

      it('returns the text response from charge card', () => {
        expect(response.text).toBe(text);
      });
    });

    describe('when chargeCard is successful', () => {
      const text = 'it worked!';
      let response;

      beforeEach.async(async () => {
        spyOn(PaymentsApi, 'chargeCard');
        PaymentsApi.chargeCard.and.callFake(() => Promise.resolve(text));
        response = await request(ordersApp).get('/process-order');
      });

      it('returns 200', () => {
        expect(response.status).toBe(200);
      });

      it('returns the text response from charge card', () => {
        expect(response.text).toBe(text);
      });

      it('logs something', () => {
        expect(log.info).toHaveBeenCalledWith('/process-order called');
      });
    });
  });
});