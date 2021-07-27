import { HookContext } from '@feathersjs/feathers';
import { NotFound } from '@feathersjs/errors';
import { ElasticBeanstalkClient, UpdateEnvironmentCommand } from '@aws-sdk/client-elastic-beanstalk';

export const addEnvVar = async (context: HookContext): Promise<HookContext> => {
  const { app, data, data: { env_vars, remove }, id, params: { user } } = context;
  
  if (!env_vars) return context;

  const environment = await app
    .service('aws/environment')
    .get(id, { internal: true, query: { $resolve: { resources: true } } });

  if (!environment) {
    throw new NotFound('No environment found with this id');
  }

  const envVarMap = environment.env_vars.reduce((acc, curr) => {
    acc[curr] = true;
    return acc;
  }, {});

  const newEnvVars = env_vars.filter(e => !envVarMap[e]);

  data.env_vars = [...environment.env_vars, ...env_vars];

  if (!environment.hosting_id) return context;

  const credentials = app.awsCreds(user);

  if (remove) {
    await deleteEnvVars(env_vars, environment, credentials);
    data.env_vars = environment.env_vars.filter(e => !env_vars.includes(e));
  } else {
    await addEnvVarsToBeanstalk(newEnvVars, environment, credentials);
  }
  
  delete data.remove;

  return context;
}

const addEnvVarsToBeanstalk = async (vars: string[], environment, credentials): Promise<void> => {
  const client = new ElasticBeanstalkClient({ region: environment.aws_region, credentials });
  const environmentName = environment?.resources?.hosting?.provider_environment;

  const command = new UpdateEnvironmentCommand({
    EnvironmentName: environmentName,
    OptionSettings: vars.map(e => {
      const varArr = e.split('=');
      const key = varArr.shift();
      const value = varArr.join('=');

      return {
        Namespace: 'aws:elasticbeanstalk:application:environment',
        OptionName: key,
        Value: value,
      }
    }),
  });

  await client.send(command);
};

const deleteEnvVars = async (vars: string[], environment, credentials) => {
  const client = new ElasticBeanstalkClient({ region: environment.aws_region, credentials });
  const environmentName = environment?.resources?.hosting?.provider_environment;
  
  const command = new UpdateEnvironmentCommand({
    EnvironmentName: environmentName,
    OptionsToRemove: vars.map(e => ({
      Namespace: 'aws:elasticbeanstalk:application:environment',
      OptionName: e.split('=')[0],
    })),
  });

  await client.send(command);
};
