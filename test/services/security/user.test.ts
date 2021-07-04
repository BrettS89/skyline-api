import app from '../../../src/app';

describe('\'security/user\' service', () => {
  it('registered the service', () => {
    const service = app.service('security/user');
    expect(service).toBeTruthy();
  });
});
