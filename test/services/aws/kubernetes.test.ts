import app from '../../../src/app';

describe('\'aws/kubernetes\' service', () => {
  it('registered the service', () => {
    const service = app.service('aws/kubernetes');
    expect(service).toBeTruthy();
  });
});
