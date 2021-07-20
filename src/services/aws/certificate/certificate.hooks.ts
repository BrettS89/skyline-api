import { authenticate } from '@/hooks';
import { setupCertificate } from './hooks';

export default {
  before: {
    all: [authenticate],
    find: [],
    get: [],
    create: [setupCertificate],
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
