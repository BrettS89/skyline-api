// Initializes the `payment/stripe` service on path `/payment/stripe`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Stripe } from './stripe.class';
import createModel from '../../../models/stripe.model';
import hooks from './hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'payment/stripe': Stripe & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/payment/stripe', new Stripe(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('payment/stripe');

  service.hooks(hooks);
}
