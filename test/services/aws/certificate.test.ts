import app from '../../../src/app';

describe('\'aws/certificate\' service', () => {
  it('registered the service', () => {
    const service = app.service('aws/certificate');
    expect(service).toBeTruthy();
  });
});
