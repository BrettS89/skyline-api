import { HookContext } from '@feathersjs/feathers';
import { CodePipelineClient, StartPipelineExecutionCommand } from '@aws-sdk/client-codepipeline';

export const executePipleline = async (context: HookContext): Promise<HookContext> => {
  const { app, data, params: { user } } = context;

  if (!data.pipeline_name) return context;
  if (!user) throw new Error('There was a user authentication error');

  const client = new CodePipelineClient({ region: data.aws_region, credentials: app.awsCreds(user) });

  const command = new StartPipelineExecutionCommand({
    name: data.pipeline_name,
  });

  await client.send(command);

  context.result = { status: 'success' };

  return context;
};
