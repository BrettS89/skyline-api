import { HookContext } from '@feathersjs/feathers';
import { CodePipelineClient, DeletePipelineCommand, DeleteWebhookCommand, DeregisterWebhookWithThirdPartyCommand } from '@aws-sdk/client-codepipeline';
import { ElasticBeanstalkClient, TerminateEnvironmentCommand } from '@aws-sdk/client-elastic-beanstalk';
import { S3Client, DeleteBucketCommand, DeleteObjectsCommand, ListObjectsCommand } from '@aws-sdk/client-s3';

export const setHostingInParams = async (context: HookContext): Promise<HookContext> => {
  const { app, id, params } = context;

  const hosting = await app.service('aws/hosting').get(id, { internal: true });

  params.hosting = hosting;

  return context;
};

export const removeWebhook = async (context: HookContext): Promise<HookContext> => {
  const { params: { hosting } } = context;

  const client = new CodePipelineClient({ region: 'us-east-1' });

  if (!hosting.webhook_name) return context;

  await client.send(new DeregisterWebhookWithThirdPartyCommand({ webhookName: hosting.webhook_name }));
  await client.send(new DeleteWebhookCommand({ name: hosting.webhook_name }));

  return context;
};

export const deletePipeline = async (context: HookContext): Promise<HookContext> => {
  const { params: { hosting } } = context;

  const client = new CodePipelineClient({ region: 'us-east-1' });
  await client.send(new DeletePipelineCommand({ name: hosting.pipeline_name }));

  return context;
};

export const terminateBeanstalkEnvironment = async (context: HookContext): Promise<HookContext> => {
  const { params: { hosting } } = context;

  const client = new ElasticBeanstalkClient({ region: 'us-east-1' });

  await client.send(new TerminateEnvironmentCommand({ EnvironmentName: hosting.provider_environment }));

  return context;
};

export const deleteBucket = async (context: HookContext): Promise<HookContext> => {
  const { params: { hosting } } = context;

  const client = new S3Client({ region: 'us-east-1' });

  const listObjects = new ListObjectsCommand({
    Bucket: hosting.bucket_name,
  });

  const objects = await client.send(listObjects);

  if (Array.isArray(objects.Contents)) {
    const deleteObjects = new DeleteObjectsCommand({
      Bucket: hosting.bucket_name,
      Delete: {
        Objects: objects.Contents.map(o => ({ Key: o.Key })), 
      },
    });
  
    await client.send(deleteObjects);
  }

  const deleteBucket = new DeleteBucketCommand({
    Bucket: hosting.bucket_name,
  });

  await client.send(deleteBucket);

  return context;
};
