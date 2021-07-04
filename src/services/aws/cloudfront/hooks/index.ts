import { authenticate } from '@/hooks';
import { createCloudfrontDistribution } from './hooks';

export default {
  before: {
    all: [authenticate],
    find: [],
    get: [],
    create: [
      createCloudfrontDistribution,
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
