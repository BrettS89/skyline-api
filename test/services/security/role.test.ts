import app from '../../../src/app';

describe('\'security/role\' service', () => {
  it('registered the service', () => {
    const service = app.service('security/role');
    expect(service).toBeTruthy();
  });
});
