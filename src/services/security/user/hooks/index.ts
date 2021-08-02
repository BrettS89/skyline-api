import { disallow, fastJoin } from 'feathers-hooks-common';
import { authenticate, authorization } from '@/hooks';
import { hashPassword, setRole, setupPipelineRoles } from './hooks';
import resolvers from '@/services/security/user/user.resolvers';

export default {
  before: {
    all: [],
    find: [authenticate, authorization(true, false)],
    get: [authenticate, authorization(true, false)],
    create: [
      hashPassword,
      setRole,
    ],
    update: [disallow()],
    patch: [authenticate, authorization(true, false)],
    remove: [authenticate, authorization(true, false)],
  },

  after: {
    all: [fastJoin(resolvers, ctx => ctx.params.resolve || {})],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [
      setupPipelineRoles,
    ],
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
