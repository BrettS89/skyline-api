import { HookContext } from '@feathersjs/feathers';
import { AttachRolePolicyCommand, CreatePolicyCommand, CreateRoleCommand, GetRoleCommand, IAMClient } from '@aws-sdk/client-iam';
import { taskExecutionTrustRelationships, codePipelineTrustRelationship, codePipelinePolicy } from './aws-data';

export * from './bucket';
export * from './beanstalk';
export * from './delete';
export * from './pipeline';
export * from './update-environment';
export * from './webhook';
export * from './execute-pipeline';
export * from './https';
export * from './ec2-https';

export const getPipelineRole = async (context: HookContext): Promise<HookContext> => {
  const { app, data, params: { user } } = context;

  const client = new IAMClient({ region: data.aws_region, credentials: app.awsCreds(user) });

  try {
    const res = await client.send(new GetRoleCommand({
      RoleName: 'skyline-pipeline-service'
    }));

    data.pipeline_role_arn = res.Role?.Arn;
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

    const pipelineRole = await client.send(new CreateRoleCommand({
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

    data.pipeline_role_arn = pipelineRole.Role?.Arn;

    return context;
  }
};

export const setAwsRegion = (context: HookContext) => {
  context.data.aws_region = 'us-east-1';
  return context;
};
