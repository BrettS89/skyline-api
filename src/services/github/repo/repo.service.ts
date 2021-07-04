// Initializes the `github/repo` service on path `/github/repo`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Repo } from './repo.class';
import hooks from './hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'github/repo': Repo & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/github/repo', new Repo(app));

  // Get our initialized service so that we can register hooks
  const service = app.service('github/repo');

  service.hooks(hooks);
}
