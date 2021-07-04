import { ACMClient, ListCertificatesCommand } from '@aws-sdk/client-acm';
import { Application } from '../../../declarations';

export class Certificate {
  app: Application;

  constructor (app: Application) {
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params): Promise<Record<string, any>> {
    const client = new ACMClient({ region: 'us-east-1' });

    let certificates: any = [];

    for (let status of ['ISSUED', 'PENDING_VALIDATION']) {
      const res = await client.send(new ListCertificatesCommand({ CertificateStatuses: [status] }));
      const certs = res.CertificateSummaryList?.map(cert => {
        return {
          ...cert,
          status,
          name: `${cert.DomainName} - ${status}`,
        };
      });

      //@ts-ignore
      certificates = [...certificates, ...certs];
    }

    return { certificates };
  }

}
