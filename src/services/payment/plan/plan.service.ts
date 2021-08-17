// Initializes the `payment/plan` service on path `/payment/plan`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Plan } from './plan.class';
import createModel from '../../../models/plan.model';
import hooks from './hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'payment/plan': Plan & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/payment/plan', new Plan(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('payment/plan');

  service.hooks(hooks);
}
