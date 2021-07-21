import { HookContext } from '@feathersjs/feathers';
import { CodePipelineClient, PutWebhookCommand, RegisterWebhookWithThirdPartyCommand } from '@aws-sdk/client-codepipeline';

export const registerWebhook = async (context: HookContext): Promise<HookContext> => {
  const { app, data, params: { user } } = context;

  if (!data.auto_deploy) return context;

  const client = new CodePipelineClient({ region: data.aws_region, credentials: app.awsCreds(user) });

  const command = new PutWebhookCommand({
    webhook: {
      authentication: 'GITHUB_HMAC',
      authenticationConfiguration: {
        SecretToken: 'wwf1989',
      },
      filters: [
        {
          jsonPath: '$.ref',
          matchEquals: `refs/heads/${data.repo_branch}`,
        },
      ],
      name: `${data.pipeline_name}-webhook`,
      targetAction: 'Source',
      targetPipeline: data.pipeline_name,
    },
  });

  const response = await client.send(command);

  const command2 = new RegisterWebhookWithThirdPartyCommand({
    webhookName: response?.webhook?.definition?.name || `${data.pipeline_name}-webhook`,
  });

  await client.send(command2);

  data.webhook_name = `${data.pipeline_name}-webhook`;

  return context;
};
