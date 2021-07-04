// Initializes the `github/client-id` service on path `/github/client-id`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { ClientId } from './client-id.class';
import hooks from './client-id.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'github/client-id': ClientId & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/github/client-id', new ClientId(app));

  // Get our initialized service so that we can register hooks
  const service = app.service('github/client-id');

  service.hooks(hooks);
}
