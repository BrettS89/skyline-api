import { HookContext } from '@feathersjs/feathers';
import { CloudWatchLogsClient, GetLogEventsCommand, DescribeLogStreamsCommand } from '@aws-sdk/client-cloudwatch-logs';

const getLogs = async (context: HookContext): Promise<HookContext> => {
  let { app, params: { user }, result } = context;

  const client = new CloudWatchLogsClient({ region: result.aws_region, credentials: app.awsCreds(user) });

  const logGroupName = result.app_type_name === 'Docker'
    ? `/aws/elasticbeanstalk/${result.environment_name}/var/log/eb-engine.log`
    : `/aws/elasticbeanstalk/${result.environment_name}/var/log/web.stdout.log`;

  const streams = await client.send(new DescribeLogStreamsCommand({
    logGroupName: logGroupName,
    descending: true,
  }));

  const streamNames = streams?.logStreams?.map(stream => stream.logStreamName) ?? [];

  const logData = await Promise.all(streamNames.map(stream => {
    return client.send(new GetLogEventsCommand({
      logGroupName,
      logStreamName: stream,
      endTime: Date.now(),
      startTime: Date.now() - 6000000,
    }));
  }));

  const formattedLogData = logData.map(logs => {
    return logs.events?.map(event => event.message) ?? [];
  });

  const dataForResult = streamNames.map((stream, i) => {
    return {
      stream_name: stream,
      logs: formattedLogData[i],
    };
  });

  context.result = dataForResult;

  return context;
}

export default getLogs;
