// Initializes the `aws/bucket` service on path `/aws/bucket`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Bucket } from './bucket.class';
import createModel from '../../../models/bucket.model';
import hooks from './hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'aws/bucket': Bucket & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/aws/bucket', new Bucket(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('aws/bucket');

  service.hooks(hooks);
}
