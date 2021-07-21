import { HookContext } from '@feathersjs/feathers'; 
import { IAMClient, CreateUserCommand } from '@aws-sdk/client-iam';

export const createIamUser = async (context: HookContext): Promise<HookContext> => {
  const { app, data, params: { user } } = context;

  const client = new IAMClient({ region: data.aws_region, credentials: app.awsCreds(user) });

  const command = new CreateUserCommand({
    UserName: `${data.bucket_name}-upload`,
    PermissionsBoundary: data.policy_arn,
  });

  const res = await client.send(command);

  delete data.bucket_name;
  delete data.policy_arn;

  data.name = res.User?.UserName;
  data.arn = res.User?.Arn;

  return context;
};
