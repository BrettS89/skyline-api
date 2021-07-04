import app from '../../../src/app';

describe('\'aws/access-keys\' service', () => {
  it('registered the service', () => {
    const service = app.service('aws/access-keys');
    expect(service).toBeTruthy();
  });
});
