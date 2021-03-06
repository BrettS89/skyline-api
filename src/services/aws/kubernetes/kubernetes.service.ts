// Initializes the `aws/kubernetes` service on path `/aws/kubernetes`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Kubernetes } from './kubernetes.class';
import createModel from '../../../models/kubernetes.model';
import hooks from './kubernetes.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'aws/kubernetes': Kubernetes & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/aws/kubernetes', new Kubernetes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('aws/kubernetes');

  service.hooks(hooks);
}
