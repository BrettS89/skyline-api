// Initializes the `github/access-token` service on path `/github/access-token`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { AccessToken } from './access-token.class';
import hooks from './access-token.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'github/access-token': AccessToken & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/github/access-token', new AccessToken(app));

  // Get our initialized service so that we can register hooks
  const service = app.service('github/access-token');

  service.hooks(hooks);
}
