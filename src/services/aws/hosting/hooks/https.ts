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
        }
      ],
  });

  await client.send(command);  

  delete data.environment_name;

  return context;
};
