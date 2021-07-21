
import { HookContext } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors';
import bcrypt from 'bcryptjs';

export * from './iam-role-setup';

export const hashPassword = (context: HookContext): HookContext => {
  const { data } = context;

  if (!data.password) {
    throw new BadRequest('Missing password');
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(data.password, salt);

  data.password = hash;

  return context;
};

export const setRole = async (context: HookContext): Promise<HookContext> => {
  const { app, data } = context;

  if (data.role_id) return context;

  const role = await app
    .service('security/role')
    .find({ query: {
      name: 'user',
    },
    paginate: false,
    internal: true,
  });

  if (!role.length) {
    throw new Error('An internal server error ocurred');
  }

  data.role_id = role[0]._id;

  return context;
};
