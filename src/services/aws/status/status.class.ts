import { ElasticBeanstalkClient, DescribeEnvironmentsCommand } from '@aws-sdk/client-elastic-beanstalk';
import { Application } from '../../../declarations';

export class Status {
  app: Application;

  constructor (app: Application) {
    this.app = app;
  }

  async find (params): Promise<any> {
    const { query, user } = params;

    const client = new ElasticBeanstalkClient({
      region: query.aws_region,
      credentials: this.app.awsCreds(user)
    });

    const command = new DescribeEnvironmentsCommand({
      EnvironmentNames: [params.query.environment],
    });

    let res: any;
    try {
      res = await client.send(command);
    } catch(e) {}
    
    return res?.Environments?.[0];
  }
}
