import '../spec_helper';
import {ConsoleRecorder, ExplicitContext, Tracer} from 'zipkin';
import * as FetchHelper from '../../helpers/fetch_helper';

describe('PaymentsApi', () => {
  let subject;
  beforeEach(() => {
    process.env.PAYMENTS_HOST = 'example.com:8080';
    subject = require('../../orders/payments_api');
  });

  afterEach(() => {
    delete process.env.PAYMENTS_HOST;
  });

  describe('#chargeCard', () => {
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

      it.async('makes an ajax call to /charge-card and returns text', async () => {
        expect(await subject.chargeCard(options)).toBe(text);
        expect(FetchHelper.fetchText).toHaveBeenCalledWith('http://example.com:8080/charge-card', options);
        expect(global.fetch).toHaveBeenCalledWith('http://example.com:8080/charge-card', jasmine.anything());
      });

      it.async('makes an ajax call to /charge-card without the hostname and protocol when PAYMENTS_HOST is not present', async () => {
        delete process.env.PAYMENTS_HOST;
        expect(await subject.chargeCard()).toBe(text);
        expect(global.fetch).toHaveBeenCalledWith('/charge-card', jasmine.anything());
      });
    });

    describe('when it is not successful', () => {
      let error;
      beforeEach(() => {
        error = {response: {status: 500}};
        spyOn(global, 'fetch').and.callFake(() => Promise.reject(error));
      });

      it.async('makes an ajax call to /charge-card and returns text', async () => {
        const err = await subject.chargeCard().catch(e => Promise.resolve(e));
        expect(err).toEqual(error);
      });
    });
  });
});