import { HookContext } from '@feathersjs/feathers';
import { CodePipelineClient, CreatePipelineCommand, ActionTypeId } from '@aws-sdk/client-codepipeline';

export const createPipeline = async (context: HookContext): Promise<HookContext> => {
  const { data, params: { user } } = context;
  const client = new CodePipelineClient({ region: 'us-east-1' });

  const command = new CreatePipelineCommand({
    pipeline: {
      artifactStore: {
        location: data.bucket_name,
        type: 'S3',
      },
      name: `${data.application_name}-pipeline`,
      roleArn: data.pipeline_role_arn ,
      stages: [
        {
          name: 'Source',
          actions: [
            {
              name: 'Source',
              actionTypeId: {
                category: 'Source',
                owner: 'ThirdParty',
                version: '1',
                provider: 'GitHub',
              },
              outputArtifacts: [
                {
                  name: 'SourceOutput',
                }
              ],
              configuration: {
                Owner: data.github_account,
                Repo: data.github_repo,
                Branch: data.repo_branch,
                OAuthToken: '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',
                PollForSourceChanges: 'false',
              },
              runOrder: 1,
            },
          ],
        },
        {
          name: 'Build',
          actions: [
            {
              name: 'DeployAction',
              actionTypeId: {
                category: 'Deploy',
                owner: 'AWS',
                version: '1',
                provider: 'ElasticBeanstalk',
              },
              inputArtifacts: [
                {
                  name: 'SourceOutput',
                }
              ],
              configuration: {
                ApplicationName: data.application_name,
                EnvironmentName: data.provider_name, 
              },
            }
          ]
        }
      ],
    },
  });

  try {
    var res = await client.send(command);
  } catch(e) {
    var res = await client.send(command);
  }
  
  data.pipeline_name = res.pipeline?.name;

  delete data.application_name;
  delete data.github_account;

  return context;
}