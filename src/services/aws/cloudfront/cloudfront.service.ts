// Initializes the `aws/cloudfront` service on path `/aws/cloudfront`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Cloudfront } from './cloudfront.class';
import createModel from '../../../models/cloudfront.model';
import hooks from './hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'aws/cloudfront': Cloudfront & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/aws/cloudfront', new Cloudfront(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('aws/cloudfront');

  service.hooks(hooks);
}
