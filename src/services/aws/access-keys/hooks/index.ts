import { authenticate } from '@/hooks';
import { createAccessKeys } from './hooks';

export default {
  before: {
    all: [authenticate],
    find: [],
    get: [],
    create: [
      createAccessKeys,
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
