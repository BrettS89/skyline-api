import { disallow } from 'feathers-hooks-common';
import { authenticate, authorization } from '@/hooks';
import getLogs from './hooks';

export default {
  before: {
    all: [authenticate],
    find: [disallow()],
    get: [],
    create: [authorization(false, true)],
    update: [disallow()],
    patch: [disallow()],
    remove: [authorization(false, true)],
  },

  after: {
    all: [],
    find: [],
    get: [getLogs],
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
