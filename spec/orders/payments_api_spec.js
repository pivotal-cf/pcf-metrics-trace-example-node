import '../spec_helper';

describe('PaymentsApi', () => {
  let subject;
  beforeEach(() => {
    process.env.PAYMENTS_HOST = 'http://example.com';
    subject = require('../../orders/payments_api');
  });

  afterEach(() => {
    delete process.env.PAYMENTS_HOST;
  });

  describe('#chargeCard', () => {
    describe('when it is successful', () => {
      const text = 'it works!';
      beforeEach(() => {
        spyOn(global, 'fetch').and.callFake(() => {
          return Promise.resolve({
            status: 200,
            text() { return Promise.resolve(text);}
          });
        });
      });

      it.async('makes an ajax call to /charge-card and returns text', async () => {
        expect(await subject.chargeCard()).toBe(text);
        expect(global.fetch).toHaveBeenCalledWith('http://example.com/charge-card', {});
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