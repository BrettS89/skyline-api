// Initializes the `storage/file` service on path `/storage/file`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { File } from './file.class';
import createModel from '../../../models/file.model';
import hooks from './file.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'storage/file': File & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/storage/file', new File(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('storage/file');

  service.hooks(hooks);
}
