import app from '../../../src/app';

describe('\'github/client-id\' service', () => {
  it('registered the service', () => {
    const service = app.service('github/client-id');
    expect(service).toBeTruthy();
  });
});
