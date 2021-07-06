import { HookContext } from '@feathersjs/feathers';

export const updateEnvironmentHook = async (context: HookContext): Promise<HookContext> => {
  const { app, result } = context;

  await app
    .service('aws/environment')
    .patch(
      result.environment_id,
      { hosting_id: result._id },
      { internal: true }
    );

  return context;
};
