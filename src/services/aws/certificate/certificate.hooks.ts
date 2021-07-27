import { authenticate } from '@/hooks';
import { getCertificateStatus, setupCertificate } from './hooks';

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
    find: [getCertificateStatus],
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
