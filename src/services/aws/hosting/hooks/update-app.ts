import { HookContext } from '@feathersjs/feathers';

export const updateAppHook = async (context: HookContext): Promise<HookContext> => {
  const { app, result } = context;

  const foundApp = await app
    .service('aws/app')
    .get(result.app_id, { internal: true });

  const environments = foundApp.environments.map(e => {
    if (e._id.toString() === result.environment_id.toString()) {
      return {
        ...e,
        hosting_id: result._id
      };
    }

    return e;
  });

  await app
    .service('aws/app')
    .patch(
      result.app_id,
      { environments },
      { internal: true }
    );

  return context;
};
