import app from '../../../src/app';

describe('\'aws/hosting\' service', () => {
  it('registered the service', () => {
    const service = app.service('aws/hosting');
    expect(service).toBeTruthy();
  });
});
