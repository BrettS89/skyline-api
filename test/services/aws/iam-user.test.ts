import app from '../../../src/app';

describe('\'aws/iam-user\' service', () => {
  it('registered the service', () => {
    const service = app.service('aws/iam-user');
    expect(service).toBeTruthy();
  });
});
