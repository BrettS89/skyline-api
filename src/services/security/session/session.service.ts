  // Initializes the `security/session` service on path `/security/session`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Session } from './session.class';
import hooks from './session.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'security/session': Session & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  // Initialize our service with any options it requires
  app.use('/security/session', new Session(app));

  // Get our initialized service so that we can register hooks
  const service = app.service('security/session');

  service.hooks(hooks);
}
