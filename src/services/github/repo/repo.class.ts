import fetch from 'node-fetch';
import { Params } from '@feathersjs/feathers'
import { Application } from '../../../declarations';

export class Repo {
  app: Application;

  constructor (app: Application) {
    this.app = app;
  }

  async find (params: Params): Promise<any> {
    const user = params.user;

    const res = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `token ${user?.github_access_key}`,
      },
    });

    const githubUser = await res.json();
    const res2 = await fetch(`${githubUser.repos_url}?per_page=100`);
    const repos = await res2.json();

    return repos.map(r => ({
      name: r.name,
      branches_url: r.branches_url.split('{')[0],
    }));
  }
}
