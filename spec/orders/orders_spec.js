import '../spec_helper';
import request from 'supertest';
import {ConsoleRecorder, ExplicitContext, Tracer} from 'zipkin';

describe('Orders', () => {
  const serviceName = 'orders';
  let ordersApp, log, tracer, ZipkinExpress;

  beforeEach(() => {
    log = jasmine.createSpyObj('log', ['info']);
    
    const ctxImpl = new ExplicitContext();
    const recorder = new ConsoleRecorder(log.info.bind(log));
    tracer = new Tracer({ctxImpl, recorder});
    
    spyOn(tracer, 'setId').and.callThrough();
    ZipkinExpress = require('zipkin-instrumentation-express');
    spyOn(ZipkinExpress, 'expressMiddleware').and.callThrough();
    ordersApp = require('../../orders/orders')(serviceName, log, tracer);
  });

  it('adds the zipkin middleware', () => {
    expect(ZipkinExpress.expressMiddleware).toHaveBeenCalledWith({serviceName, tracer});
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
      const traceId = 'some-trace-id';
      const spanId = 'some-span-id';
      const text = 'it worked!';
      let response;

      beforeEach.async(async () => {
        spyOn(PaymentsApi, 'chargeCard');
        PaymentsApi.chargeCard.and.callFake(() => Promise.resolve(text));
        response = await request(ordersApp).get('/process-order').set({
          'X-B3-TraceId': traceId,
          'X-B3-SpanId': spanId
        });
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

      it('sets the trace id, span id and parent id', () => {
        expect(tracer.setId).toHaveBeenCalled();
        const trace = tracer.setId.calls.all()[0].args[0];
        expect(trace.traceId).toEqual(traceId);
        expect(trace.spanId).toEqual(spanId);
        expect(trace.parentId).toEqual(spanId);
      });

      it('makes a request to charge card with the tracer', () => {
        expect(PaymentsApi.chargeCard).toHaveBeenCalledWith({tracer});
      });
    });
  });
});