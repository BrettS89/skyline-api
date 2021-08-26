import { HookContext } from '@feathersjs/feathers';

export const addCreditCard = async (context: HookContext): Promise<HookContext> => {
  let { app, data, params: { user } } = context;

  const {
    number,
    exp_date,
    cvc,
  } = data;

  //@ts-ignore
  const { id, card: { brand, last4 } } = await app.stripe.tokens.create({
    //@ts-ignore
    card: {
      number,
      exp_month: Number(exp_date.split('/')[0]),
      exp_year: Number(exp_date.split('/')[1]),
      cvc,
    },
  });

  const response = await app.stripe.customers.create({
    source: id,
    email: user?.email,
  });

  context.data = {
    card_id: id,
    customer_id: response.id,
    user_id: user?._id,
    card_brand: brand,
    card_last_4: last4,
  };

  return context;
};
