import { fastJoin } from 'feathers-hooks-common';
import { authenticate } from '@/hooks';
import resolvers from '../environment.resolvers';
import { addEnvVar } from './add-env-vars';

export default {
  before: {
    all: [authenticate],
    find: [],
    get: [],
    create: [],
    update: [],
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
