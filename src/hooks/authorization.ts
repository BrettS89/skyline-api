import { HookContext } from '@feathersjs/feathers';
import { NotAcceptable } from '@feathersjs/errors';

export const authorization = (userId: boolean, internalOnly: boolean, superAdmin?: boolean) => {
  return (context: HookContext): HookContext => {
    let { id, path, params, method } = context;

    if (params.internal) {
      return context;
    }

    if (superAdmin && params.user?.role?.name !== 'superadmin') {
      throw new NotAcceptable();
    }

    if (internalOnly && !params.internal) {
      throw new NotAcceptable();
    }

    if (userId) {
      if (method === 'find') {
        params.query = {
          ...params.query,
          user_id: params?.user?._id,
        };
      }

      if (id && path.includes('security/user')) {
        id = params.user?._id
      }
    }

    return context;
  };
};
