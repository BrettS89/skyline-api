import { disallow } from 'feathers-hooks-common';
import { authenticate, authorization } from '@/hooks';
import { getCertificateStatus, setupCertificate } from './hooks';

export default {
  before: {
    all: [authenticate],
    find: [authorization(true, false)],
    get: [disallow()],
    create: [setupCertificate],
    update: [disallow()],
    patch: [disallow()],
    remove: [],
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
