import app from '../../../src/app';

describe('\'payment/stripe\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment/stripe');
    expect(service).toBeTruthy();
  });
});
