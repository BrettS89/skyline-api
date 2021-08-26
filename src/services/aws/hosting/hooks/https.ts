import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import { DescribeEnvironmentResourcesCommand, ElasticBeanstalkClient, UpdateEnvironmentCommand } from '@aws-sdk/client-elastic-beanstalk';
import { ElasticLoadBalancingV2Client, DescribeListenersCommand, ModifyListenerCommand } from '@aws-sdk/client-elastic-load-balancing-v2';

export const addHttpsListener = async (context: HookContext): Promise<HookContext> => {
  const { app, data, params: { user } } = context;

  if (!data.ssl_certificate_arn || !data.environment_name) return context;

  if (user?.plan?.plan !== 'production') {
    throw new BadRequest('Your plan does not support https forwarding');
  }

  const credentials = app.awsCreds(user)

  const client = new ElasticBeanstalkClient({ region: data.aws_region, credentials });
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
      ],
  });

  await client.send(command);
  await setupHttpsRedirect(client, data.environment_name, data.aws_region, credentials);

  delete data.environment_name;

  return context;
};

const setupHttpsRedirect = async (beanstalkClient, environmentName: string, region: string, credentials): Promise<void> => {
  const loadBalancerClient = new ElasticLoadBalancingV2Client({ region, credentials });

  const res1 = await beanstalkClient.send(
    new DescribeEnvironmentResourcesCommand({
      EnvironmentName: environmentName 
    })
  );

  const elbArn = res1.EnvironmentResources.LoadBalancers[0].Name;

  const command2 = new DescribeListenersCommand({ LoadBalancerArn: elbArn });
  const res2 = await loadBalancerClient.send(command2);

  const command3 = new ModifyListenerCommand({
    ListenerArn: res2?.Listeners?.[0].ListenerArn,
    DefaultActions: [
      {
        Type: 'redirect',
        Order: 1,
        RedirectConfig: {
          Protocol: 'HTTPS',
          Port: '443',
          Host: '#{host}',
          Path: '/#{path}',
          Query: '#{query}',
          StatusCode: 'HTTP_301'
        },
      },
    ]
  });

  await loadBalancerClient.send(command3);
};
