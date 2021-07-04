// Initializes the `github/branch` service on path `/github/branch`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Branch } from './branch.class';
import hooks from './branch.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'github/branch': Branch & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/github/branch', new Branch(app));

  // Get our initialized service so that we can register hooks
  const service = app.service('github/branch');

  service.hooks(hooks);
}
