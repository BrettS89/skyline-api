// Initializes the `aws/iam-user` service on path `/aws/iam-user`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { IamUser } from './iam-user.class';
import createModel from '../../../models/iam-user.model';
import hooks from './hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'aws/iam-user': IamUser & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/aws/iam-user', new IamUser(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('aws/iam-user');

  service.hooks(hooks);
}
