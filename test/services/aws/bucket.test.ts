import app from '../../../src/app';

describe('\'aws/bucket\' service', () => {
  it('registered the service', () => {
    const service = app.service('aws/bucket');
    expect(service).toBeTruthy();
  });
});
