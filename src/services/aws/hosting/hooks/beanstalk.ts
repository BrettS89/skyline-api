import { HookContext } from '@feathersjs/feathers';
import { ElasticBeanstalkClient, CreateApplicationCommand, CreateEnvironmentCommand } from '@aws-sdk/client-elastic-beanstalk';

const forSingleInstance = {
  Namespace: 'aws:elasticbeanstalk:environment',
  OptionName: 'EnvironmentType',
  Value: 'SingleInstance',
};

export const createBeanstalk = async (context: HookContext): Promise<HookContext> => {
  const { app, data, params: { user } } = context;

  const optionSettings = [
    {
      Namespace: 'aws:autoscaling:launchconfiguration',
      OptionName: 'IamInstanceProfile',
      Value: 'aws-elasticbeanstalk-ec2-role',
    },
  ];

  if (data.provider_type.includes('EC2')) {
    //@ts-ignore
    optionSettings.push(forSingleInstance);

    optionSettings.push({
      Namespace: 'aws:ec2:instances',
      OptionName: 'InstanceTypes',
      Value: data.provider_value,
    });

    data.autoscale = false;
  } else {
    optionSettings.push({
      Namespace: 'aws:elasticbeanstalk:environment',
      OptionName: 'LoadBalancerType',
      Value: 'application'
    });

    data.autoscale = true;
  }

  const client = new ElasticBeanstalkClient({ region: data.aws_region, credentials: app.awsCreds(user) });
  const command = new CreateApplicationCommand({
    ApplicationName: data.application_name,
  });

  await client.send(command);

  const command2 = new CreateEnvironmentCommand({
    ApplicationName: data.application_name,
    EnvironmentName: `${data.application_name}-env`,
    SolutionStackName: data.app_type,
    OptionSettings: optionSettings,
  });

  const res = await client.send(command2);

  data.provider_arn = res.EnvironmentArn;
  data.provider_name = `${data.application_name}-env`;
  data.provider_environment = `${data.application_name}-env`;
  data.auto_deploy = true;
  data.url = res.CNAME;

  return context;
};
