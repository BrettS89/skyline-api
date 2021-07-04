import app from '../../../src/app';

describe('\'storage/signature\' service', () => {
  it('registered the service', () => {
    const service = app.service('storage/signature');
    expect(service).toBeTruthy();
  });
});
