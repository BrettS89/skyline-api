import { HookContext } from '@feathersjs/feathers';

const resolvers = {
  joins: {
    role: (...args: any) => async (resource: Record<string, any>, { app }: HookContext) => {
      resource.role = (
        await app.service('security/role').get(resource.role_id, { internal: true })
      )
    },
    stripe: (...args: any) => async (resource: Record<string, any>, { app }: HookContext) => {
      resource.stripe = (
        (await app
          .service('payment/stripe')
          .find({ query: { user_id: resource._id }, internal: true, paginate: false }))[0] || null
      )
    },
    plan: (...args: any) => async (resource: Record<string, any>, { app }: HookContext) => {
      resource.plan = (
        (await app
          .service('payment/plan')
          .find({ query: { user_id: resource._id }, internal: true, paginate: false}))[0] || null
      )
    },
  }
};

export default resolvers;
