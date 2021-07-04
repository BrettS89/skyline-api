// Initializes the `aws/hosting` service on path `/aws/hosting`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Hosting } from './hosting.class';
import createModel from '../../../models/hosting.model';
import hooks from './hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'aws/hosting': Hosting & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/aws/hosting', new Hosting(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('aws/hosting');

  service.hooks(hooks);
}
