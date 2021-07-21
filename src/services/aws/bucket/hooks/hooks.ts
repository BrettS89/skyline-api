import { HookContext } from '@feathersjs/feathers';
import { S3Client, CreateBucketCommand, PutBucketCorsCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';

export const createBucket = async (context: HookContext): Promise<HookContext> => {
  const { app, data, params: { user } } = context; 

  const client = new S3Client({ region: data.aws_region, credentials: app.awsCreds(user) });

  const command = new CreateBucketCommand({
    Bucket: data.bucket_name,
    ObjectLockEnabledForBucket: false
  });

  await client.send(command);

  return context;
};

export const putCorsPolicy = async (context: HookContext): Promise<HookContext> => {
  const { app, data, params: { user } } = context;

  const client = new S3Client({ region: data.aws_region, credentials: app.awsCreds(user) });

  const command = new PutBucketCorsCommand({
    Bucket: data.bucket_name,
    CORSConfiguration: {
      CORSRules: app.get('bucketCorsRules')
    }
  });

  await client.send(command);

  return context;
};

export const putBucketPolicy = async (context: HookContext): Promise<HookContext> => {
  const { app, data, params: { user } } = context;

  const client = new S3Client({ region: data.aws_region, credentials: app.awsCreds(user) });

  const policy = {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::" + data.bucket_name + "/*"
      }
    ]
  };

  const command = new PutBucketPolicyCommand({
    Bucket: data.bucket_name,
    Policy: JSON.stringify(policy),
  });

  await client.send(command);

  data.name = data.bucket_name;

  delete data.bucket_name;

  return context;
};
