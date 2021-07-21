import { Application } from '../declarations';
import getAwsCredentials from './get-aws-creds';
// Don't remove this comment. It's needed to format import lines nicely.

declare module '@feathersjs/feathers' {
  interface Application {
    awsCreds(user: Record<string, any> | undefined): { accessKeyId: string, secretAccessKey: string }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
export default function (app: Application): void {
  app.awsCreds = getAwsCredentials;
}
