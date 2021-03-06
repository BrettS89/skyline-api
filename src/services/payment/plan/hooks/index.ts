import { disallow } from 'feathers-hooks-common';
import { authenticate } from '@/hooks';
import { cancelSubscription, subscribeToPlan, upgradePlan } from './hooks';

export default {
  before: {
    all: [
      authenticate,
    ],
    find: [],
    get: [disallow()],
    create: [
      subscribeToPlan,
    ],
    update: [disallow()],
    patch: [upgradePlan],
    remove: [cancelSubscription],
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
