import { initTRPC } from '@trpc/server'

import type { Context } from './context'
import { transformer } from './transformer'

const t = initTRPC.context<Context>().create({ transformer })

export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId || !ctx.token) throw new Error('Unauthorized')
  return next({ ctx })
})

export const router = t.router
