import { HookContext } from '@feathersjs/feathers';
import { ElasticBeanstalkClient, UpdateEnvironmentCommand } from '@aws-sdk/client-elastic-beanstalk';

export const addHttpsListener = async (context: HookContext): Promise<HookContext> => {
  const { data } = context;

  if (!data.ssl_certificate_arn || !data.environment_name) return context;

  const client = new ElasticBeanstalkClient({ region: 'us-east-1' });
  const command = new UpdateEnvironmentCommand({
    EnvironmentName: data.environment_name,
      OptionSettings: [
        {
          Namespace: 'aws:elbv2:listener:443',
          OptionName: 'SSLCertificateArns',
          Value: data.ssl_certificate_arn,
        },
        {
          Namespace: 'aws:elbv2:listener:443',
          OptionName: 'Protocol',
          Value: 'HTTPS'
        },
        {
          Namespace: 'aws:elasticbeanstalk:environment:process:https',
          OptionName: 'Port',
          Value: '443'
        },
        {
          Namespace: 'aws:elasticbeanstalk:environment:process:https',
          OptionName: 'Protocol',
          Value: 'HTTPS',
        },
        {
          Namespace: 'aws:elbv2:listenerrule:tohttps',
          OptionName: 'PathPatterns',
          Value: '/*',
        },
        {
          Namespace: 'aws:elbv2:listenerrule:tohttps',
          OptionName: 'Priority',
          Value: '1',
        },
        {
          Namespace: 'aws:elbv2:listenerrule:tohttps',
          OptionName: 'Process',
          Value: 'https',
        },
        {
          Namespace: 'aws:elbv2:listener:80',
          OptionName: 'Rules',
          Value: 'tohttps'
        },
      ],
  });

  await client.send(command);  

  delete data.environment_name;

  return context;
};
