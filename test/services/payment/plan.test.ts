import app from '../../../src/app';

describe('\'payment/plan\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment/plan');
    expect(service).toBeTruthy();
  });
});
