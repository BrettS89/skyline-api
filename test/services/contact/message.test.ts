import app from '../../../src/app';

describe('\'contact/message\' service', () => {
  it('registered the service', () => {
    const service = app.service('contact/message');
    expect(service).toBeTruthy();
  });
});
