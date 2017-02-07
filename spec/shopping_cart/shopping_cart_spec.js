import '../spec_helper';
import request from 'supertest';
import {ConsoleRecorder, ExplicitContext, Tracer} from 'zipkin';


describe('ShoppingCart', () => {
  const serviceName = 'shopping-cart';
  let shoppingCartApp, log, tracer, ZipkinExpress;

  beforeEach(() => {
    log = jasmine.createSpyObj('log', ['info']);

    const ctxImpl = new ExplicitContext();
    const recorder = new ConsoleRecorder(log.info.bind(log));
    tracer = new Tracer({ctxImpl, recorder});

    spyOn(tracer, 'setId').and.callThrough();
    ZipkinExpress = require('zipkin-instrumentation-express');
    spyOn(ZipkinExpress, 'expressMiddleware').and.callThrough();

    shoppingCartApp = require('../../shopping_cart/shopping_cart')(serviceName, log, tracer);
  });

  it('adds the zipkin middleware', () => {
    expect(ZipkinExpress.expressMiddleware).toHaveBeenCalledWith({serviceName, tracer});
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
      const traceId = 'some-trace-id';
      const spanId = 'some-span-id';
      const text = 'it worked!';
      let response;

      beforeEach.async(async () => {
        spyOn(OrdersApi, 'processOrder');
        OrdersApi.processOrder.and.callFake(() => Promise.resolve(text));
        response = await request(shoppingCartApp).get('/checkout').set({
          'X-B3-TraceId': traceId,
          'X-B3-SpanId': spanId
        });
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

      it('sets the trace id, span id and parent id', () => {
        expect(tracer.setId).toHaveBeenCalled();
        const trace = tracer.setId.calls.all()[0].args[0];
        expect(trace.traceId).toEqual(traceId);
        expect(trace.spanId).toEqual(spanId);
        expect(trace.parentId).toEqual(spanId);
      });

      it('makes a request to charge card with the tracer', () => {
        expect(OrdersApi.processOrder).toHaveBeenCalledWith({tracer});
      });
    });
  });
});