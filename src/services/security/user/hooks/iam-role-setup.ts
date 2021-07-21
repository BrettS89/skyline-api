import { HookContext } from '@feathersjs/feathers';
import { AttachRolePolicyCommand, CreatePolicyCommand, CreateRoleCommand, GetRoleCommand, IAMClient } from '@aws-sdk/client-iam';
import { taskExecutionTrustRelationships, codePipelineTrustRelationship, codePipelinePolicy } from './aws-data';

export const setupPipelineRoles = async (context: HookContext): Promise<HookContext> => {
  const { app, params: { user } } = context;

  const credentials = app.awsCreds(user);

  const regions = ['us-east-1'];

  for (let region of regions) {
    await getOrCreatePipelineRole(region, credentials);
  }

  return context;
};

const getOrCreatePipelineRole = async (region: string, credentials): Promise<void> => {
  const client = new IAMClient({ region: region, credentials });

  try {
    await client.send(new GetRoleCommand({
      RoleName: 'skyline-pipeline-service'
    }));

  } catch(e) {
    const executionRole = await client.send(new CreateRoleCommand({
      RoleName: 'skyline-pipeline-execution',
      AssumeRolePolicyDocument: JSON.stringify(taskExecutionTrustRelationships),
    }));

    await client.send(new AttachRolePolicyCommand({
      RoleName: 'skyline-pipeline-execution',
      PolicyArn: 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
    }));

    await client.send(new CreateRoleCommand({
      RoleName: 'skyline-pipeline-service',
      AssumeRolePolicyDocument: JSON.stringify(codePipelineTrustRelationship),
    }));

    const policy = await client.send(new CreatePolicyCommand({
      PolicyName: 'skyline-pipeline-policy',
      PolicyDocument: JSON.stringify(codePipelinePolicy(executionRole.Role?.Arn)),
    }));

    await client.send(new AttachRolePolicyCommand({
      RoleName: 'skyline-pipeline-service',
      PolicyArn: policy.Policy?.Arn,
    }));
  }
}

