import { disallow } from 'feathers-hooks-common';
import { authenticate, authorization } from '@/hooks';
import {
  addHttpsListener,
  checkPlan,
  createBucket,
  createLog,
  deleteBucket,
  deleteLogs,
  ec2Https,
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
    find: [authorization(false, true)],
    get: [authorization(false, true)],
    create: [
      checkPlan,
      createBucket, 
      getPipelineRole,
      createBeanstalk,
      createPipeline,
      registerWebhook,
    ],
    update: [disallow()],
    patch: [
      addHttpsListener,
      ec2Https,
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
      createLog,
    ],
    update: [],
    patch: [],
    remove: [
      deleteLogs,
    ]
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
