import { HookContext } from '@feathersjs/feathers';
import Stripe from 'stripe';

export const addCreditCard = async (context: HookContext): Promise<HookContext> => {
  let { app, data, params: { user } } = context;

  const {
    number,
    exp_month,
    exp_year,
    cvc,
  } = data;

  const stripe = new Stripe(app.get('stripeSecret'), {
    apiVersion: '2020-08-27'
  });

  //@ts-ignore
  const { id, card: { brand, last4 } } = await stripe.tokens.create({
    card: {
      number,
      exp_month,
      exp_year,
      cvc,
    },
  });

  const response = await stripe.customers.create({
    source: id,
    email: user?.email,
  });

  data = {
    card_id: id,
    customer_id: response.id,
    user_id: user?._id,
    card_brand: brand,
    card_last_4: last4,
  };

  return context;
};
