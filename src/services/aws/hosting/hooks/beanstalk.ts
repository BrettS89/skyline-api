import { HookContext } from '@feathersjs/feathers';
import { ElasticBeanstalkClient, CreateApplicationCommand, CreateEnvironmentCommand } from '@aws-sdk/client-elastic-beanstalk';

const forSingleInstance = {
  Namespace: 'aws:elasticbeanstalk:environment',
  OptionName: 'EnvironmentType',
  Value: 'SingleInstance',
};

export const createBeanstalk = async (context: HookContext): Promise<HookContext> => {
  const { data } = context;

  const optionSettings = [
    {
      Namespace: 'aws:autoscaling:launchconfiguration',
      OptionName: 'IamInstanceProfile',
      Value: 'aws-elasticbeanstalk-ec2-role',
    },
  ];

  if (data.provider_type.includes('single')) {
    //@ts-ignore
    optionSettings.push(forSingleInstance);
  } else {
    optionSettings.push({
      Namespace: 'aws:elasticbeanstalk:environment',
      OptionName: 'LoadBalancerType',
      Value: 'application'
    });

    // optionSettings.push({
    //   Namespace: 'aws:elbv2:listener:80',
    //   OptionName: 'Protocol',
    //   Value: 'HTTP'
    // });

    // optionSettings.push({
    //   Namespace: 'aws:elbv2:listener:443',
    //   OptionName: 'SSLCertificateArns',
    //   Value: 'arn:aws:acm:us-east-1:882330273289:certificate/59a844da-7b3e-4270-a6fa-dd16b114eca2'
    // });

    // optionSettings.push({
    //   Namespace: 'aws:elbv2:listener:443',
    //   OptionName: 'Protocol',
    //   Value: 'HTTPS'
    // });
  }

  const client = new ElasticBeanstalkClient({ region: 'us-east-1' });
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
