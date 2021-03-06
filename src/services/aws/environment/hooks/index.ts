import { fastJoin } from 'feathers-hooks-common';
import { disallow } from 'feathers-hooks-common';
import { authenticate, authorization } from '@/hooks';
import resolvers from '../environment.resolvers';
import { addEnvVar } from './add-env-vars';

export default {
  before: {
    all: [authenticate],
    find: [disallow()],
    get: [authorization(false, true, false)],
    create: [],
    update: [disallow()],
    patch: [addEnvVar],
    remove: []
  },

  after: {
    all: [fastJoin(resolvers, ctx => ctx.params.resolve || {})],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
