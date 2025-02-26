'use node'

import { createClerkClient } from '@clerk/backend'
import { v } from 'convex/values'

import { action, internalAction } from '../_generated/server'

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

export const getUserFromEmail = internalAction({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await clerkClient.users.getUserList({ emailAddress: [args.email] })
    if (result.data.length > 0) {
      return result.data[0].id // there should only be one user with this email
    }
    return null
  },
})

export const getUserFromId = action({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await clerkClient.users.getUser(args.id)
    return {
      email: user.primaryEmailAddress?.emailAddress,
      fullName: user.fullName,
      image: user.imageUrl,
    }
  },
})
