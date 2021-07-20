import { fastJoin } from 'feathers-hooks-common';
import { hashPassword, setRole, setupPipelineRoles } from './hooks';
import resolvers from '@/services/security/user/user.resolvers';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hashPassword,
      setRole,
      // setupPipelineRoles,
    ],
    update: [],
    patch: [],
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
