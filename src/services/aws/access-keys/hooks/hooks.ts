import { HookContext } from '@feathersjs/feathers';
import { IAMClient, CreateAccessKeyCommand } from '@aws-sdk/client-iam';

export const createAccessKeys = async (context: HookContext): Promise<HookContext> => {
  const { data } = context;

  const client = new IAMClient({ region: 'us-east-1' });
  const command = new CreateAccessKeyCommand({ UserName: data.iam_user_name });
  const res = await client.send(command);

  delete data.iam_user_name;

  data.access_key_id = res.AccessKey?.AccessKeyId;
  data.secret_access_key = res.AccessKey?.SecretAccessKey;

  return context;
};
