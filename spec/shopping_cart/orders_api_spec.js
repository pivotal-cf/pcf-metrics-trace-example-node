import '../spec_helper';
import {ConsoleRecorder, ExplicitContext, Tracer} from 'zipkin';
import * as FetchHelper from '../../helpers/fetch_helper';

describe('OrdersApi', () => {
  let subject;
  beforeEach(() => {
    subject = require('../../shopping_cart/orders_api');
    process.env.ORDERS_HOST = 'example.com:8080';
  });
  
  afterEach(() => {
    delete process.env.ORDERS_HOST;
  });

  describe('#processOrder', () => {
    describe('when it is successful', () => {
      const text = 'it works!';
      let options;

      beforeEach(() => {
        spyOn(FetchHelper, 'fetchText').and.callThrough();
        const ctxImpl = new ExplicitContext();
        const recorder = new ConsoleRecorder(() => {});
        const tracer = new Tracer({ctxImpl, recorder});

        options = {tracer};

        spyOn(global, 'fetch').and.callFake(() => {
          return Promise.resolve({
            status: 200,
            text() { return Promise.resolve(text);}
          });
        });
      });

      it.async('makes an ajax call to /process-order and returns text', async () => {
        expect(await subject.processOrder(options)).toBe(text);
        expect(FetchHelper.fetchText).toHaveBeenCalledWith('http://example.com:8080/process-order', options);
        expect(global.fetch).toHaveBeenCalledWith('http://example.com:8080/process-order', jasmine.anything());

      });

      it.async('makes an ajax call to /process-order without the hostname and protocol when ORDERS_HOST is not present', async () => {
        delete process.env.ORDERS_HOST;
        expect(await subject.processOrder(options)).toBe(text);
        expect(global.fetch).toHaveBeenCalledWith('/process-order', jasmine.anything());
      });
    });

    describe('when it is not successful', () => {
      let error;
      beforeEach(() => {
        error = {response: {status: 500}};
        spyOn(global, 'fetch').and.callFake(() => Promise.reject(error));
      });

      it.async('makes an ajax call to /process-order and returns text', async () => {
        const err = await subject.processOrder().catch(e => Promise.resolve(e));
        expect(err).toEqual(error);
      });
    });
  });
});