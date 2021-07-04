import app from '../../../src/app';

describe('\'storage/file\' service', () => {
  it('registered the service', () => {
    const service = app.service('storage/file');
    expect(service).toBeTruthy();
  });
});
