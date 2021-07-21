import app from '../../../src/app';

describe('\'aws/certificate2\' service', () => {
  it('registered the service', () => {
    const service = app.service('aws/certificate-2');
    expect(service).toBeTruthy();
  });
});
