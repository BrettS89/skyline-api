import app from '../../../src/app';

describe('\'aws/app\' service', () => {
  it('registered the service', () => {
    const service = app.service('aws/app');
    expect(service).toBeTruthy();
  });
});
