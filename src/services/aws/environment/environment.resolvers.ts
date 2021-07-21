import { HookContext } from '@feathersjs/feathers';

const resolvers = {
  joins: {
    resources: (...args: any) => async (resource: Record<string, any>, { app }: HookContext) => {
      resource.resources =
        {
          _id: resource._id,
          bucket: resource.bucket_id ? await app.service('aws/bucket').get(resource.bucket_id, { internal: true }) : null,
          cloudfront: resource.cloudfront_id ? await app.service('aws/cloudfront').get(resource.cloudfront_id, { internal: true }) : null,
          env: resource.env_vars || [],
          iam_user: resource.iam_user_id ? await app.service('aws/iam-user').get(resource.iam_user_id, { internal: true }) : null,
          policy: resource.policy_id ? await app.service('aws/policy').get(resource.policy_id, { internal: true }) : null,
          access_keys: resource.access_keys_id ? await app.service('aws/access-keys').get(resource.access_keys_id, { internal: true }): null,
          environment: resource.environment,
          hosting: resource.hosting_id ? await app.service('aws/hosting').get(resource.hosting_id, { internal: true }) : null,
        };
    },
  },
};

export default resolvers;
