import '../spec_helper';
import {ConsoleRecorder, ExplicitContext, Tracer, TraceId} from 'zipkin';
import {Some} from 'zipkin/src/option';

describe('FetchHelper', () => {
  let subject;
  beforeEach(() => {
    subject = require('../../helpers/fetch_helper');
  });

  describe('#fetchText', () => {
    describe('for the tracer option', () => {
      describe('when a tracer is not provided', () => {
        it.async('does not add the headers', async () => {
          spyOn(global, 'fetch').and.callFake(() => Promise.resolve({status: 200, text: () => Promise.resolve('text')}));
          await subject.fetchText('/some-url');
          expect(global.fetch).toHaveBeenCalledWith('/some-url', {});
        });
      });
      
      describe('when a tracer is provided', () => {
        const traceId = 'some-trace-id';
        const spanId = 'some-span-id';
        const parentId = 'some-parent-id';
        let tracer;

        beforeEach(() => {
          const log = jasmine.createSpyObj('log', ['info']);
          const ctxImpl = new ExplicitContext();
          const recorder = new ConsoleRecorder(log.info.bind(log));
          tracer = new Tracer({ctxImpl, recorder});
          ctxImpl.setContext({traceId, spanId, parentId});
        });

        it.async('adds the expected headers', async () => {
          spyOn(global, 'fetch').and.callFake(() => Promise.resolve({status: 200, text: () => Promise.resolve('text')}));
          await subject.fetchText('/some-url', {tracer});
          const headers = jasmine.objectContaining({'X-B3-TraceId': traceId, 'X-B3-SpanId': jasmine.any(String), 'X-B3-ParentSpanId': spanId});
          expect(global.fetch).toHaveBeenCalledWith('/some-url', jasmine.objectContaining({headers}));
        });
      });
    });
    
    describe('when the status code is not in 2XX', () => {
      it.async('rejects', async() => {
        spyOn(global, 'fetch').and.callFake(() => {
          return Promise.resolve({
            status: 500,
            statusText: 'some error',
            text() {
              return Promise.resolve('some error');
            }
          });
        });
        const err = await subject.fetchText('/some-url')
          .catch(e => Promise.resolve(e));
        expect(err.message).toEqual('some error');
      });
    });
  });
});