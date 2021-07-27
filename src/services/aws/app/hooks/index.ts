import { fastJoin } from 'feathers-hooks-common';
import { authenticate } from '@/hooks';
import { deleteHostings } from './delete';
import resolvers from '../app.resolvers';

export default {
  before: {
    all: [authenticate],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [
      deleteHostings,
    ],
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
