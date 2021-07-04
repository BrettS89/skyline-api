import { HookContext } from '@feathersjs/feathers';
import fetch from 'node-fetch';

export const getRepos = async (context: HookContext) => {
  const { params: { user } } = context;

  const res = await fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      Authorization: `token ${user?.github_access_key}`,
    },
  });

  const githubUser = await res.json();

  const res2 = await fetch(githubUser.owner.repos_url);
  const repos = await res2.json();

  return repos.map(r => ({
    name: r.name,
    branches_url: r.branches_url.split('{')[0],
  }));
};
