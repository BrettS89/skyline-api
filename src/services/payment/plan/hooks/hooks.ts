import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';

export const subscribeToPlan = async (context: HookContext): Promise<HookContext> => {
  let { app, data, params: { user } } = context;

  if (!user?.stripe?.card_id) {
    throw new BadRequest('A credit card must be on file to subscribe to a Skyline plan.');
  }

  const subscription = await app.stripe.subscriptions.create({
    customer: user.stripe.customer_id,
    items: [
      { 
        price: app.get(data.plan + 'Plan'),
      },
    ],
  });  

  context.data = {
    plan: data.plan,
    //@ts-ignore
    subscription_id: subscription.id,
    user_id: user?._id,
  };

  return context;
};

export const cancelSubscription = async (context: HookContext): Promise<HookContext> => {
  const { app, params: { user } } = context;

  await app.stripe.subscriptions.del(user?.plan?.subscription_id);

  return context;
};
