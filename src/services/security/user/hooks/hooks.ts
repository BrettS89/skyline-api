
import { HookContext } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors';
import bcrypt from 'bcryptjs';

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
