import { HookContext } from '@feathersjs/feathers';
import { AddRoleToInstanceProfileCommand, AttachRolePolicyCommand, CreateInstanceProfileCommand, CreatePolicyCommand, CreateRoleCommand, GetRoleCommand, IAMClient } from '@aws-sdk/client-iam';
import { beanstalkTrust, taskExecutionTrustRelationships, codePipelineTrustRelationship, codePipelinePolicy } from './aws-data';

export const setupPipelineRoles = async (context: HookContext): Promise<HookContext> => {
  const { data, app, result } = context;

  if (!data.aws_keys?.access_key_id || !data.aws_keys?.secret_access_key) {
    return context;
  }

  const credentials = app.awsCreds(result);

  const regions = ['us-east-1'];

  for (let region of regions) {
    await getOrCreatePipelineRole(region, credentials);
  }

  await setupBeanstalkRoles('us-east-1', credentials)

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

const setupBeanstalkRoles = async (region, credentials) => {
  const client = new IAMClient({ region: region, credentials });

  try {
    await client.send(new GetRoleCommand({
      RoleName: 'aws-elasticbeanstalk-ec2-role',
    }));

  } catch(e) {
    await client.send(new CreateRoleCommand({
      RoleName: 'aws-elasticbeanstalk-ec2-role',
      AssumeRolePolicyDocument: JSON.stringify(beanstalkTrust),
    }));

    await client.send(new AttachRolePolicyCommand({
      RoleName: 'aws-elasticbeanstalk-ec2-role',
      PolicyArn: 'arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier',
    }));

    await client.send(new AttachRolePolicyCommand({
      RoleName: 'aws-elasticbeanstalk-ec2-role',
      PolicyArn: 'arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker',
    }));

    await client.send(new AttachRolePolicyCommand({
      RoleName: 'aws-elasticbeanstalk-ec2-role',
      PolicyArn: 'arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier',
    }));

    await client.send(new CreateInstanceProfileCommand({
      InstanceProfileName: 'aws-elasticbeanstalk-ec2-role',
    }));

    await client.send(new AddRoleToInstanceProfileCommand({
      RoleName: 'aws-elasticbeanstalk-ec2-role',
      InstanceProfileName: 'aws-elasticbeanstalk-ec2-role',
    }));
  }
}
