import app from '../../../src/app';

describe('\'aws/log\' service', () => {
  it('registered the service', () => {
    const service = app.service('aws/log');
    expect(service).toBeTruthy();
  });
});
