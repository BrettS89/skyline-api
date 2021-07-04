import app from '../../../src/app';

describe('\'security/account\' service', () => {
  it('registered the service', () => {
    const service = app.service('security/account');
    expect(service).toBeTruthy();
  });
});
