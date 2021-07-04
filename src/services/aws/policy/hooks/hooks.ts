import { HookContext } from '@feathersjs/feathers';
import { CreatePolicyCommand, IAMClient  } from '@aws-sdk/client-iam';

const createPolicyObj = (bucketName: string): Record<string, any> => ({
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "s3:PutAccountPublicAccessBlock",
        "s3:GetAccountPublicAccessBlock",
        "s3:ListAllMyBuckets",
        "s3:HeadBucket"
      ],
      "Resource": "*"
    },
    {
      "Sid": "VisualEditor1",
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::" + bucketName,
        "arn:aws:s3:::" + bucketName + "/*"
      ]
    }
  ]
});

export const createPolicy = async (context: HookContext): Promise<HookContext> => {
  const { data } = context;

  const client = new IAMClient({ region: 'us-east-1' });

  const params = {
    PolicyDocument: JSON.stringify(createPolicyObj(data.bucket_name)),
    PolicyName: `${data.bucket_name}-upload`,
  };

  const res = await client.send(new CreatePolicyCommand(params));

  data.name = `${data.bucket_name}-upload`;
  data.arn = res.Policy?.Arn;

  delete data.bucket_name;

  return context;
};
