import app from '@/app';
import fetch from 'node-fetch';
import { Application } from '../../../declarations';

export class AccessToken {
  app: Application;

  constructor (app: Application) {
    this.app = app;
  }

  async create (data: Record<string, any>, params): Promise<any> {
    const clientId = process.env.GITHUB_APP_CLIENT_ID;
    const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET;

    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: data.code,
      }),
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
    });

    const token = await res.json();

    const res2 = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `token ${token.access_token}`,
      },
    });

    const githubUser = await res2.json();

    const patchedUser = await app.service('security/user')
    .patch(params?.user?._id, {
      github_username: githubUser?.login,
      github_access_key: token.access_token,
    }, { query: { $resolve: { role: true } }, internal: true });
 
    return patchedUser;
  }
}
