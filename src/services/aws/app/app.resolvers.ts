import { HookContext } from '@feathersjs/feathers';

const resolvers = {
  joins: {
    environments: (...args: any) => async (resource: Record<string, any>, { app }: HookContext) => {
      resource.environments = (
        await Promise.all(resource.environment_ids.map(env => {
          return app.service('aws/environment').get(env, {
            internal: true,
            query: {
              $resolve: { resources: true },
            },
          });
        }))
      )
    },
  }
};

export default resolvers;
