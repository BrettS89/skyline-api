import { disallow } from 'feathers-hooks-common'; 
import { authenticate, authorization } from '@/hooks';

export default {
  before: {
    all: [authenticate],
    find: [authorization(false, true, false,)],
    get: [authorization(false, true, false)],
    create: [authorization(false, false, true)],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()],
  },

  after: {
    all: [],
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
