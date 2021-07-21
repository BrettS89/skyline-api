import { HookContext } from '@feathersjs/feathers';
import { v4 as uuid } from 'uuid';
import { S3Client, CreateBucketCommand } from '@aws-sdk/client-s3';

export const createBucket = async (context: HookContext): Promise<HookContext> => {
  const { app, data, params: { user } } = context;

  const client = new S3Client({ region: data.aws_region, credentials: app.awsCreds(user) });

  const bucketName = `pipeline-bucket-${uuid()}`

  const command = new CreateBucketCommand({
    Bucket: bucketName,
    ObjectLockEnabledForBucket: false
  });

  await client.send(command);

  data.bucket_name = bucketName;

  return context;
};
