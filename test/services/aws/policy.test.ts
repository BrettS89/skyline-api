import app from '../../../src/app';

describe('\'aws/policy\' service', () => {
  it('registered the service', () => {
    const service = app.service('aws/policy');
    expect(service).toBeTruthy();
  });
});
