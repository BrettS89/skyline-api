import { HookContext } from '@feathersjs/feathers';
import { AttachRolePolicyCommand, CreatePolicyCommand, CreateRoleCommand, GetRoleCommand, IAMClient } from '@aws-sdk/client-iam';
import { taskExecutionTrustRelationships, codePipelineTrustRelationship, codePipelinePolicy } from './aws-data';

export const getPipelineRole = async (context: HookContext): Promise<HookContext> => {
  const client = new IAMClient({ region: 'us-east-1' });

  try {
    await client.send(new GetRoleCommand({
      RoleName: 'skyline-pipeline-service'
    }));

    return context;

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

    return context;
  }
};

