import { HookContext } from '@feathersjs/feathers';

export const deleteHostings = async (context: HookContext): Promise<HookContext> => {
  const { app, id, params: { user } } = context;

  try {
    var foundApp = await app
    .service('aws/app')
    .get(id, { internal: true, query: { $resolve: { environments: true,  }, user_id: user?._id } });
  } catch(e) {
    console.log(e)
  }
  
    
    await Promise.all(
    foundApp.environments
      .filter(env => !!env.hosting_id)
      .map(env => {
        return app
          .service('aws/hosting')
          .remove(env.hosting_id.toString(), { internal: true, query: { user_id: user?._id } });
      })
  );

  console.log('hi')

  await Promise.all(foundApp.environments.map(e => {
    return app.service('aws/environment').remove(e._id, { internal: true });
  }));

  return context;
};
