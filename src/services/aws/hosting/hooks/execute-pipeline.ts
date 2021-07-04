import { HookContext } from '@feathersjs/feathers';
import { CodePipelineClient, StartPipelineExecutionCommand } from '@aws-sdk/client-codepipeline';

export const executePipleline = async (context: HookContext): Promise<HookContext> => {
  const { data } = context;

  if (!data.pipeline_name) return context;

  const client = new CodePipelineClient({ region: 'us-east-1' });

  const command = new StartPipelineExecutionCommand({
    name: data.pipeline_name,
  });

  await client.send(command);

  context.result = { status: 'success' };

  return context;
};
