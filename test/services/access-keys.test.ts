import app from '../../src/app';

describe('\'access-keys\' service', () => {
  it('registered the service', () => {
    const service = app.service('access-keys');
    expect(service).toBeTruthy();
  });
});
