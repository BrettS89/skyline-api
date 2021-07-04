import { HookContext } from '@feathersjs/feathers';

const resolvers = {
  joins: {
    fetched_environments: (...args: any) => async (resource: Record<string, any>, { app }: HookContext) => {
      resource.fetched_environments = (
        await Promise.all(resource.environments.map(async env => {
          return {
            _id: env._id,
            bucket: env.bucket_id ? await app.service('aws/bucket').get(env.bucket_id, { internal: true }) : null,
            cloudfront: env.cloudfront_id ? await app.service('aws/cloudfront').get(env.cloudfront_id, { internal: true }) : null,
            env_vars: env.env_vars || [],
            iam_user: env.iam_user_id ? await app.service('aws/iam-user').get(env.iam_user_id, { internal: true }) : null,
            policy: env.policy_id ? await app.service('aws/policy').get(env.policy_id, { internal: true }) : null,
            access_keys: env.access_keys_id ? await app.service('aws/access-keys').get(env.access_keys_id, { internal: true }): null,
            environment: env.environment,
            hosting: env.hosting_id ? await app.service('aws/hosting').get(env.hosting_id, { internal: true }) : null,
          };
        }))
      )
    },
  }
};

export default resolvers;
