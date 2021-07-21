import { HookContext } from '@feathersjs/feathers';
import { ACMClient, DescribeCertificateCommand, ListCertificatesCommand, RequestCertificateCommand } from '@aws-sdk/client-acm';
import { sleep } from '@/utilities';

export const setupCertificate = async (context: HookContext): Promise<HookContext> => {
  const { app, data, params: { user } } = context;

  const client = new ACMClient({ region: data.aws_region, credentials: app.awsCreds(user) });
  const requestCertCommand = new RequestCertificateCommand({
    DomainName: data.domain,
    ValidationMethod: 'DNS',
  });

  const res = await client.send(requestCertCommand);

  const describeCertCommand = new DescribeCertificateCommand({
    CertificateArn: res.CertificateArn,
  });

  await sleep(5000);

  let cert = await client.send(describeCertCommand);

  if (!cert?.Certificate?.DomainValidationOptions?.[0]?.ResourceRecord) {
    await sleep(1000);
    cert = await client.send(describeCertCommand);
  }

  const resourceRecord = cert?.Certificate?.DomainValidationOptions?.[0]?.ResourceRecord

  data.arn = cert.Certificate?.CertificateArn;
  data.status = cert.Certificate?.Status;

  data.cname = {
    name: resourceRecord?.Name,
    type: resourceRecord?.Type,
    value: resourceRecord?.Value,
  };

  data.user_id = user?._id;

  return context;
}
