import { authenticate } from '@/hooks';
import {
  addHttpsListener,
  createBucket,
  deleteBucket,
  terminateBeanstalkEnvironment,
  deletePipeline,
  executePipleline,
  getPipelineRole,
  createBeanstalk,
  createPipeline,
  registerWebhook,
  removeWebhook,
  setHostingInParams,
  updateAppHook,
} from './hooks';

export default {
  before: {
    all: [authenticate],
    find: [],
    get: [],
    create: [
      createBucket,
      getPipelineRole,
      createBeanstalk,
      createPipeline,
      registerWebhook,
    ],
    update: [],
    patch: [
      addHttpsListener,
      executePipleline,
    ],
    remove: [
      setHostingInParams,
      removeWebhook,
      deletePipeline,
      terminateBeanstalkEnvironment,
      deleteBucket,
    ],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      updateAppHook,
    ],
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
