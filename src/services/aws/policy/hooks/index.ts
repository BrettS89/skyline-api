import { authenticate } from '@/hooks';
import { createPolicy } from './hooks';

export default {
  before: {
    all: [authenticate],
    find: [],
    get: [],
    create: [
      createPolicy,
    ],
    update: [],
    patch: [],
    remove: []
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
