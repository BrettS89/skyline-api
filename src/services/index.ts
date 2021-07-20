import { Application } from '../declarations';
import securityUser from './security/user/user.service';
import dataTag from './data/tag/tag.service';
import securityRole from './security/role/role.service';
import awsBucket from './aws/bucket/bucket.service';
import awsIamUser from './aws/iam-user/iam-user.service';
import awsPolicy from './aws/policy/policy.service';
import awsCloudfront from './aws/cloudfront/cloudfront.service';
import awsAccessKeys from './aws/access-keys/access-keys.service';
import storageSignature from './storage/signature/signature.service';
import storageFile from './storage/file/file.service';
import securityAccount from './security/account/account.service';
import securitySession from './security/session/session.service';
import awsApp from './aws/app/app.service';
import githubClientId from './github/client-id/client-id.service';
import awsHosting from './aws/hosting/hosting.service';
import githubAccessToken from './github/access-token/access-token.service';
import githubRepo from './github/repo/repo.service';
import githubBranch from './github/branch/branch.service';
import awsStatus from './aws/status/status.service';
import awsEnvironment from './aws/environment/environment.service';
import awsKubernetes from './aws/kubernetes/kubernetes.service';
import awsCertificate from './aws/certificate/certificate.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(securityUser);
  app.configure(dataTag);
  app.configure(securityRole);
  app.configure(awsBucket);
  app.configure(awsIamUser);
  app.configure(awsPolicy);
  app.configure(awsCloudfront);
  app.configure(awsAccessKeys);
  app.configure(storageSignature);
  app.configure(storageFile);
  app.configure(securityAccount);
  app.configure(securitySession);
  app.configure(awsApp);
  app.configure(githubClientId);
  app.configure(awsHosting);
  app.configure(githubAccessToken);
  app.configure(githubRepo);
  app.configure(githubBranch);
  app.configure(awsStatus);
  app.configure(awsEnvironment);
  app.configure(awsKubernetes);
  app.configure(awsCertificate);
}
