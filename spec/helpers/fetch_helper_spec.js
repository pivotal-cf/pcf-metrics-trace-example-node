import '../spec_helper';

describe('FetchHelper', () => {
  let subject;
  beforeEach(() => {
    subject = require('../../helpers/fetch_helper');
  });

  describe('#fetchText', () => {
    describe('when the status code is not in 2XX', () => {
      it.async('rejects', async () => {
        spyOn(global, 'fetch').and.callFake(() => {
          return Promise.resolve({
            status: 500,
            statusText: 'some error',
            text() { return Promise.resolve(error)}
          });
        });
        const err = await subject.fetchText('/some-url')
          .catch(e => Promise.resolve(e));
        expect(err.message).toEqual('some error');
      });
    });
  });
});