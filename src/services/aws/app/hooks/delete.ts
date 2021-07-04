import { HookContext } from '@feathersjs/feathers';

export const deleteHostings = async (context: HookContext): Promise<HookContext> => {
  const { app, id } = context;

  const foundApp = await app
    .service('aws/app')
    .get(id, { internal: true });

  await Promise.all(
    foundApp.environments
      .filter(env => !!env.hosting_id)
      .map(env => {
        return app
          .service('aws/hosting')
          .remove(env.hosting_id, { internal: true });
      })
  );

  return context;
};
