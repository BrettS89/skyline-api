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
  setAwsRegion,
  setHostingInParams,
  updateEnvironmentHook,
} from './hooks';

export default {
  before: {
    all: [authenticate],
    find: [],
    get: [],
    create: [
      setAwsRegion,
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
      updateEnvironmentHook,
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
