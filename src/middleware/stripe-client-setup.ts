import Stripe from 'stripe';

const stripeClientSetup = (app) =>
  new Stripe(app.get('stripeSecret'), {
    apiVersion: '2020-08-27'
  });

export default stripeClientSetup;
