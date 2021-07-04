import fetch from 'node-fetch';
import { Application } from '../../../declarations';

export class Branch {
  app: Application;

  constructor (app: Application) {
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params): Promise<Record<string, any>> {
    const url = params?.query?.branches_url;
    const user = params.user;

    if (!url) return Promise.resolve([]);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: user.github_access_key,
      },
    });

    const branches = await res.json();

    return branches.map(b => ({ name: b.name })).filter(b => !b.name.includes('dependabot'));
  }
}
