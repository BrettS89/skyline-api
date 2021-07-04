// Initializes the `aws/policy` service on path `/aws/policy`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Policy } from './policy.class';
import createModel from '../../../models/policy.model';
import hooks from './hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'aws/policy': Policy & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/aws/policy', new Policy(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('aws/policy');

  service.hooks(hooks);
}
