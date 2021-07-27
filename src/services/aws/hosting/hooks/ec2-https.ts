import { HookContext } from '@feathersjs/feathers';
import { CloudFrontClient, CreateDistributionCommand } from '@aws-sdk/client-cloudfront';
import app from '@/app';

export const ec2Https = async (context: HookContext): Promise<HookContext> => {
  const { data, params: { user } } = context;
  if (!data.ssl_certificate_arn || !data.domain_name) {
    return context;
  }

  const client = new CloudFrontClient({ region: data.aws_region, credentials: app.awsCreds(user) });

  const command = new CreateDistributionCommand({
    DistributionConfig: {
      Enabled: true,
      Comment: `ec2 cloudfront distribution`,
      CallerReference: new Date().toISOString(),
      Aliases: {
        Items: [
          data.domain_name,
        ],
        Quantity: 1
      },
      Origins: {
        Items: [
          {
            DomainName: data.url,
            Id: data.url,
            CustomOriginConfig: {
              OriginProtocolPolicy: 'http-only',
              HTTPPort: 80,
              HTTPSPort: 443,              
            },
          },
        ],
        Quantity: 1,
      },
      DefaultCacheBehavior: {
        TargetOriginId: data.url,
        ViewerProtocolPolicy: 'redirect-to-https',
        MinTTL: 1000,
        ForwardedValues: {
          Cookies: { Forward: 'all' },
          Headers: { Quantity: 0 },
          QueryString: false,
          QueryStringCacheKeys: { Quantity: 0 },
          //@ts-ignore
          CachePolicy: 'CachingDisabled',
        },
      },
      ViewerCertificate: {
        ACMCertificateArn: data.ssl_certificate_arn,
        SSLSupportMethod: 'sni-only',
      }
    },
  });

  const res = await client.send(command);
  console.log(res.Distribution);
  delete data.aws_region;
  delete data.url;

  data.cloudfront_url = res.Distribution?.DomainName;
console.log(context.data);
  return context;
};
