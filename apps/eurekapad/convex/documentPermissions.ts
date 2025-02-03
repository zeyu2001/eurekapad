import { createClerkClient } from '@clerk/backend'
import { v } from 'convex/values'

import { api, internal } from './_generated/api'
import { mutation, query } from './_generated/server'

const _clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

export const sharedWith = query({
  args: { documentId: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const userId = identity.subject

    const document = await ctx.db.get(args.documentId)

    if (!document) {
      throw new Error('Not found')
    }

    const sharedWith = await ctx.db
      .query('documentPermisisons')
      .withIndex('by_document', q => q.eq('documentId', args.documentId))
      .collect()

    if (document.userId !== userId && sharedWith.filter(permission => permission.userId === userId).length === 0) {
      throw new Error('Unauthorized')
    }

    return sharedWith
  },
})

export const share = mutation({
  args: { id: v.id('documents'), shares: v.array(v.object({ email: v.string(), isEditor: v.boolean() })) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity || !identity.email) {
      throw new Error('Not authenticated')
    }

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    }

    // const _shareTo = await clerkClient.users.getUserList({ emailAddress: args.emailAddresses })
    const document = await ctx.runQuery(api.documents.getById, { documentId: args.id })

    await ctx.scheduler.runAfter(0, internal.emails.actions.sendShareEmails, {
      shares: args.shares,
      invitedByEmail: identity.email,
      invitedByName: identity.name || identity.email,
      documentTitle: document.title,
      inviteLink: `https://eurekapad.app/document/${document._id}`,
    })
  },
})
