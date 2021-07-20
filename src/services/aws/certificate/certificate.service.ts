// Initializes the `aws/certificate2` service on path `/aws/certificate-2`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Certificate } from './certificate.class';
import createModel from '../../../models/certificate.model';
import hooks from './certificate.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'aws/certificate': Certificate & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/aws/certificate', new Certificate(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('aws/certificate');

  service.hooks(hooks);
}
