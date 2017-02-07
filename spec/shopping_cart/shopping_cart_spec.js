import '../spec_helper';

describe('Orders', () => {
  let shoppingCartApp, request, log;

  beforeEach(() => {
    request = require('supertest');
    log = jasmine.createSpyObj('log', ['info']);
    shoppingCartApp = require('../../shopping_cart/index')(log);
  });

  describe('GET /checkout', () => {
    let OrdersApi;
    beforeEach(() => {
      OrdersApi = require('../../shopping_cart/orders_api');
    });

    describe('when processOrder is not successful', () => {
      const text = 'some kind of error';
      let response;

      beforeEach.async(async () => {
        spyOn(OrdersApi, 'processOrder');
        OrdersApi.processOrder.and.callFake(() => Promise.reject({response: {status: 400, text}}));
        response = await request(shoppingCartApp).get('/checkout');
      });

      it('returns 503', () => {
        expect(response.status).toBe(503);
      });

      it('returns the text response from process order', () => {
        expect(response.text).toBe(text);
      });
    });

    describe('when processOrder is successful', () => {
      const text = 'it worked!';
      let response;

      beforeEach.async(async () => {
        spyOn(OrdersApi, 'processOrder');
        OrdersApi.processOrder.and.callFake(() => Promise.resolve(text));
        response = await request(shoppingCartApp).get('/checkout');
      });

      it('returns 200', () => {
        expect(response.status).toBe(200);
      });

      it('returns the text response from process order', () => {
        expect(response.text).toBe(text);
      });

      it('logs something', () => {
        expect(log.info).toHaveBeenCalledWith('/checkout called');
      });
    });
  });
});