import { HookContext } from '@feathersjs/feathers';
import { ACMClient, DescribeCertificateCommand, RequestCertificateCommand } from '@aws-sdk/client-acm';
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
};

export const getCertificateStatus = async (context: HookContext): Promise<HookContext> => {
  const { app, result, params: { user } } = context;
  const credentials = app.awsCreds(user);

  const certificates = await Promise.all(result.data.map(cert => {
    const client = new ACMClient({ region: cert.aws_region, credentials });
    const command = new DescribeCertificateCommand({
      CertificateArn: cert.arn,
    });

    return client.send(command);
  }));

  const resultWithStatus = result.data.map((cert, i) => {
    return {
      ...cert,
      //@ts-ignore
      status: certificates[i]?.Certificate?.Status
    }
  });

  result.data = resultWithStatus;

  return context;
};
