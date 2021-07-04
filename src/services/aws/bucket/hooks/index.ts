import { authenticate } from '@/hooks';
import { createBucket, putBucketPolicy, putCorsPolicy } from './hooks';

export default {
  before: {
    all: [authenticate],
    find: [],
    get: [],
    create: [
      createBucket,
      putCorsPolicy,
      putBucketPolicy,
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
