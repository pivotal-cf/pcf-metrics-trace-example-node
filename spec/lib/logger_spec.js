import '../spec_helper';

describe('Logger', () => {
  let subject;

  beforeEach(() => {
    subject = require('../../lib/logger')();
  });

  it('returns a logger', () => {
    expect(subject.debug).toEqual(jasmine.any(Function));
    expect(subject.info).toEqual(jasmine.any(Function));
    expect(subject.warn).toEqual(jasmine.any(Function));
    expect(subject.error).toEqual(jasmine.any(Function));
    expect(subject.fatal).toEqual(jasmine.any(Function));
  });
});