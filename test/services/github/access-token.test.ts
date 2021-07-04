import app from '../../../src/app';

describe('\'github/access-token\' service', () => {
  it('registered the service', () => {
    const service = app.service('github/access-token');
    expect(service).toBeTruthy();
  });
});
