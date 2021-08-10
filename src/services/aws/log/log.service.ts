// Initializes the `aws/log` service on path `/aws/log`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Log } from './log.class';
import createModel from '../../../models/log.model';
import hooks from './hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'aws/log': Log & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/aws/log', new Log(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('aws/log');

  service.hooks(hooks);
}