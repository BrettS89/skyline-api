import { HookContext } from '@feathersjs/feathers';
import { NotFound } from '@feathersjs/errors';
import { ElasticBeanstalkClient, UpdateEnvironmentCommand } from '@aws-sdk/client-elastic-beanstalk';

export const addEnvVar = async (context: HookContext): Promise<HookContext> => {
  const { app, data, data: { environment_id, env_vars, remove }, id } = context;
  
  if (!env_vars) return context;

  const foundApp = await app
    .service('aws/app')
    .get(id, { internal: true, query: { $resolve: { fetched_environments: true } } });

  const environment = foundApp
    .environments
    .find(e => e._id.toString() === environment_id);

  if (!environment) {
    throw new NotFound('No environment found with this id');
  }

  const envVarMap = environment.env_vars.reduce((acc, curr) => {
    acc[curr] = true;
    return acc;
  }, {});

  const newEnvVars = env_vars.filter(e => !envVarMap[e]);

  const updatedEnvironments = formatEnvironmentsToPatch(environment, env_vars, foundApp, remove);

  data.environments = updatedEnvironments;

  delete data.envrionment_id;
  delete data.env_vars;
  delete data.remove;

  if (!environment.hosting_id) return context;

  if (remove) {
    await deleteEnvVars(env_vars, foundApp.fetched_environments, environment_id);
  } else {
    await addEnvVarsToBeanstalk(newEnvVars, foundApp.fetched_environments, environment_id);
  }
  
  
  return context;
}

const addEnvVarsToBeanstalk = async (vars: string[], fetchedEnvironments, environment_id): Promise<void> => {
  const client = new ElasticBeanstalkClient({ region: 'us-east-1' });
  const environmentName = getProviderEnvironment(fetchedEnvironments, environment_id);
  
  const command = new UpdateEnvironmentCommand({
    EnvironmentName: environmentName,
    OptionSettings: vars.map(e => ({
      Namespace: 'aws:elasticbeanstalk:application:environment',
      OptionName: e.split('=')[0],
      Value: e.split('=')[1],
    })),
  });

  await client.send(command);
};

const deleteEnvVars = async (vars: string[], fetchedEnvironments, environment_id) => {
  const client = new ElasticBeanstalkClient({ region: 'us-east-1' });
  const environmentName = getProviderEnvironment(fetchedEnvironments, environment_id);
  
  const command = new UpdateEnvironmentCommand({
    EnvironmentName: environmentName,
    OptionsToRemove: vars.map(e => ({
      Namespace: 'aws:elasticbeanstalk:application:environment',
      OptionName: e.split('=')[0],
    })),
  });

  await client.send(command);
};

const formatEnvironmentsToPatch = (environment, envVars, app, remove = false): Record<string, any> => {
  const updatedEnvironment = environment;

  if (remove) {
    updatedEnvironment.env_vars = updatedEnvironment.env_vars.filter(e => !envVars.includes(e));
  } else {
    updatedEnvironment.env_vars = [...updatedEnvironment.env_vars, ...envVars];
  }
  

  const updatedEnvironments = app.environments.map(e => {
    if (updatedEnvironment._id.toString() === e._id.toString()) {
      return updatedEnvironment;
    }
    return e;
  });

  return updatedEnvironments;
};

const getProviderEnvironment = (fetchedEnvironments, environment_id) => {
  const environment = fetchedEnvironments
    .find(e => e._id.toString() === environment_id);

  return environment?.hosting?.provider_environment;
};
