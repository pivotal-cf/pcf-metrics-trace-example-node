import '../spec_helper';
import request from 'supertest';
import {ConsoleRecorder, ExplicitContext, Tracer} from 'zipkin';

describe('Payments', () => {
  const serviceName = 'payments';
  let paymentsApp, log, tracer, ZipkinExpress;

  beforeEach(() => {
    log = jasmine.createSpyObj('log', ['info']);
    const ctxImpl = new ExplicitContext();
    const recorder = new ConsoleRecorder(log.info.bind(log));
    tracer = new Tracer({ctxImpl, recorder});
    spyOn(tracer, 'setId').and.callThrough();
    ZipkinExpress = require('zipkin-instrumentation-express');
    spyOn(ZipkinExpress, 'expressMiddleware').and.callThrough();
    paymentsApp = require('../../payments/payments')(serviceName, log, tracer);
  });

  it('adds the zipkin middleware', () => {
    expect(ZipkinExpress.expressMiddleware).toHaveBeenCalledWith({serviceName, tracer});
  });

  describe('GET /charge-card', () => {
    const traceId = 'some-trace-id';
    const spanId = 'some-span-id';
    let response;
    beforeEach.async(async () => {
      response = await request(paymentsApp).get('/charge-card').set({
        'X-B3-TraceId': traceId,
        'X-B3-SpanId': spanId
      });
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

    it('sets the trace id, span id and parent id', () => {
      expect(tracer.setId).toHaveBeenCalled();
      const trace = tracer.setId.calls.all()[0].args[0];
      expect(trace.traceId).toEqual(traceId);
      expect(trace.spanId).toEqual(spanId);
      expect(trace.parentId).toEqual(spanId);
    });
  });
});