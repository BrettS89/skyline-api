import { HookContext } from '@feathersjs/feathers';
import { CloudFrontClient, CreateDistributionCommand } from '@aws-sdk/client-cloudfront';

export const createCloudfrontDistribution = async (context: HookContext): Promise<HookContext> => {
  const { data } = context;

  const client = new CloudFrontClient({ region: 'us-east-1' });

  const command = new CreateDistributionCommand({
    DistributionConfig: {
      Enabled: true,
      Comment: `${data.bucket_name} bucket cloudfront distribution`,
      CallerReference: new Date().toISOString(),
      Origins: {
        Items: [
          {
            DomainName: `${data.bucket_name}.s3.amazonaws.com`,
            Id: data.bucket_name,
            S3OriginConfig: { OriginAccessIdentity: '' },
          }
        ],
        Quantity: 1,
      },
      DefaultCacheBehavior: {
        TargetOriginId: data.bucket_name,
        ViewerProtocolPolicy: 'redirect-to-https',
        MinTTL: 1000,
        ForwardedValues: {
          Cookies: { Forward: 'all' },
          Headers: { Quantity: 0 },
          QueryString: false,
          QueryStringCacheKeys: { Quantity: 0 }
        },
      },
    },
  });

  const res = await client.send(command);

  delete data.bucket_name;
  data.key = res.Distribution?.DomainName;
  data.arn = res.Distribution?.ARN;
  data.distribution_id = res.Distribution?.Id;

  return context;
};
