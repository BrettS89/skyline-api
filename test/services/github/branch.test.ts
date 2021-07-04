import app from '../../../src/app';

describe('\'github/branch\' service', () => {
  it('registered the service', () => {
    const service = app.service('github/branch');
    expect(service).toBeTruthy();
  });
});
