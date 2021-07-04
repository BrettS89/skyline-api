import { ElasticBeanstalkClient, DescribeEnvironmentsCommand } from '@aws-sdk/client-elastic-beanstalk';
import { Application } from '../../../declarations';

export class Status {
  app: Application;

  constructor (app: Application) {
    this.app = app;
  }

  async find (params): Promise<any> {
    const client = new ElasticBeanstalkClient({ region: 'us-east-1' });

    const command = new DescribeEnvironmentsCommand({
      EnvironmentNames: [params.query.environment],
    });

    let res: any;
    try {
      res = await client.send(command);
    } catch(e) {
      console.log('ERROR', e);
    }
    
    return res?.Environments?.[0];
  }
}
