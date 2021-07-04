// Initializes the `aws/app` service on path `/aws/app`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { App } from './app.class';
import createModel from '../../../models/app.model';
import hooks from './hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'aws/app': App & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/aws/app', new App(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('aws/app');

  service.hooks(hooks);
}
