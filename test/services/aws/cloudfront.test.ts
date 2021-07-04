import app from '../../../src/app';

describe('\'aws/cloudfront\' service', () => {
  it('registered the service', () => {
    const service = app.service('aws/cloudfront');
    expect(service).toBeTruthy();
  });
});
