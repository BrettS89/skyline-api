// Initializes the `aws/environment` service on path `/aws/environment`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Environment } from './environment.class';
import createModel from '../../../models/environment.model';
import hooks from './hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'aws/environment': Environment & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/aws/environment', new Environment(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('aws/environment');

  service.hooks(hooks);
}
