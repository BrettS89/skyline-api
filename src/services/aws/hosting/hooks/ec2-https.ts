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
        AllowedMethods: {
          Items: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
          Quantity: 7,
        },
        TargetOriginId: data.url,
        ViewerProtocolPolicy: 'redirect-to-https',
        CachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad',
        OriginRequestPolicyId: '216adef6-5c7f-47e4-b989-5492eafa07d3',
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
