import app from '../../../src/app';

describe('\'github/repo\' service', () => {
  it('registered the service', () => {
    const service = app.service('github/repo');
    expect(service).toBeTruthy();
  });
});
