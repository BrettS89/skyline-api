import { HookContext } from '@feathersjs/feathers';

export const createLog = async (context: HookContext): Promise<HookContext> => {
  let { app, result } = context;

  const log = await app
    .service('aws/log')
    .create({
      aws_region: result.aws_region,
      environment_id: result.environment_id,
      hosting_id: result._id,
      app_type_name: result.app_type_name,
      environment_name: result.provider_environment,
    }, { internal: true });

  const updatedHosting = await app
    .service('aws/hosting')
    .patch(result._id, { log_id: log._id }, { internal: true });

  result = updatedHosting;

  return context;
}
