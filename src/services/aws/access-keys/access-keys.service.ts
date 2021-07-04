// Initializes the `aws/access-keys` service on path `/aws/access-keys`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { AccessKeys } from './access-keys.class';
import createModel from '../../../models/access-keys.model';
import hooks from './hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'aws/access-keys': AccessKeys & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/aws/access-keys', new AccessKeys(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('aws/access-keys');

  service.hooks(hooks);
}
