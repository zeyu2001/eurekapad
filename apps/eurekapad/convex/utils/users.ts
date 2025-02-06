'use node'

import { createClerkClient } from '@clerk/backend'
import { v } from 'convex/values'

import { internalAction } from '../_generated/server'

export const getUserFromEmail = internalAction({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    })

    const result = await clerkClient.users.getUserList({ emailAddress: [args.email] })
    if (result.data.length > 0) {
      return result.data[0].id // there should only be one user with this email
    }
    return null
  },
})
