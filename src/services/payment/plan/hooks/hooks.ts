import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import Stripe from 'stripe';

export const subscribeToPlan = async (context: HookContext): Promise<HookContext> => {
  let { app, data, params: { user } } = context;

  const stripe = new Stripe(app.get('stripeSecret'), {
    apiVersion: '2020-08-27'
  });

  if (!user?.stripe_id) {
    throw new BadRequest('A credit card must be on file to subscribe to a Skyline plan.');
  }

  const stripeRecord = await app.service('payment/stripe').find({
    query: {
      user_id: user?._id,
    },
    internal: true,
    paginate: false,
  });

  if (!stripeRecord.length ?? !stripeRecord[0].card_id) {
    throw new BadRequest('A credit card must be on file to subscribe to a Skyline plan.');
  }

  const subscription = await stripe.subscriptions.create({
    customer: stripeRecord[0].customer_id,
    items: [
      {
        price: app.get(`${data.plan}_PLAN_ID`),
      },
    ],
  });

  data = {
    plan: data.plan,
    subscription_id: subscription.id,
    user_id: user?._id,
  };

  return context;
};
