import { HookContext } from '@feathersjs/feathers'

export const resolve = (context: HookContext): HookContext => {
  if (context.params?.query?.$resolve) {
    context.params.resolve = context.params.query.$resolve
    delete context.params.query.$resolve
  }

  return context
};
