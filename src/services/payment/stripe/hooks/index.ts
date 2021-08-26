import { authenticate } from '@/hooks';
import { addCreditCard } from './hooks';

export default {
  before: {
    all: [
      authenticate,
    ],
    find: [],
    get: [],
    create: [
      addCreditCard,
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
