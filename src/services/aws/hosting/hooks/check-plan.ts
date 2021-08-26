import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';

export const checkPlan = async (context: HookContext): Promise<HookContext> => {
  const { app, data, params: { user } } = context;

  const planLimits = {
    development: 10,
    production: 20,
  };

  const getPlan = () => app
    .service('pricing/plan')
    .find({
      query: { user_id: user?._id },
      internal: true,
      paginate: false,
    })
    .then(plans => plans[0]);

  const getHostings = app
    .service('aws/hosting')
    .find({
      query: { user_id: user?._id },
      internal: true,
      paginate: false,
    });

  const [plan, hostings] = await Promise.all([getPlan(), getHostings()]);

  const hostingsLimit = planLimits[plan.plan] || 1;

  if (hostings.length >= hostingsLimit) {
    throw new BadRequest(`Your plan only supports up to ${hostingsLimit} environment(s)`);
  }

  const isAutoScale = data.provider_type.includes('EC2');

  if ((plan?.plan !== 'production') && isAutoScale) {
    throw new BadRequest('Your plan does not support Elastic Beanstalk environments');
  }

  return context;
};
