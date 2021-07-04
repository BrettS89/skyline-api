import app from '../../../src/app';

describe('\'aws/status\' service', () => {
  it('registered the service', () => {
    const service = app.service('aws/status');
    expect(service).toBeTruthy();
  });
});
