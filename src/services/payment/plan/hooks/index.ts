import { authenticate } from '@/hooks';
import { subscribeToPlan } from './hooks';

export default {
  before: {
    all: [
      authenticate,
    ],
    find: [],
    get: [],
    create: [
      subscribeToPlan,
    ],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  }
};
