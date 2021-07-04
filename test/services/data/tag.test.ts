import app from '../../../src/app';

describe('\'data/tag\' service', () => {
  it('registered the service', () => {
    const service = app.service('data/tag');
    expect(service).toBeTruthy();
  });
});
