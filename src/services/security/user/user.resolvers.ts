import { HookContext } from '@feathersjs/feathers';

const resolvers = {
  joins: {
    role: (...args: any) => async (resource: Record<string, any>, { app }: HookContext) => {
      resource.role = (
        await app.service('security/role').get(resource.role_id, { internal: true })
      )
    },
  }
};

export default resolvers;