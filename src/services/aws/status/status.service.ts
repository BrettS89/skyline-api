// Initializes the `aws/status` service on path `/aws/status`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Status } from './status.class';
import hooks from './status.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'aws/status': Status & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/aws/status', new Status(app));

  // Get our initialized service so that we can register hooks
  const service = app.service('aws/status');

  service.hooks(hooks);
}
