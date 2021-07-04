import app from '../../../src/app';

describe('\'security/session\' service', () => {
  it('registered the service', () => {
    const service = app.service('security/session');
    expect(service).toBeTruthy();
  });
});
