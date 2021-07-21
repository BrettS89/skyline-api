const getAwsCredentials = (user: Record<string, any> | undefined) => {
  if (!user) throw new Error('Something went wrong');

  const creds = {
    accessKeyId: user.aws_keys.access_key_id,
    secretAccessKey: user.aws_keys.secret_access_key,
  };

  if (!creds.accessKeyId || !creds.secretAccessKey) {
    throw new Error('Missing AWS credentials');
  }

  return creds;
};

export default getAwsCredentials;
