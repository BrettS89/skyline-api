import app from '../../../src/app';

describe('\'aws/environment\' service', () => {
  it('registered the service', () => {
    const service = app.service('aws/environment');
    expect(service).toBeTruthy();
  });
});
