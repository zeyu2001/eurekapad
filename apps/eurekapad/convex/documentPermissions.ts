import { createClerkClient } from '@clerk/backend'
import { v } from 'convex/values'
import { Resend } from 'resend'

import { api, internal } from './_generated/api'
import { internalAction, mutation, query } from './_generated/server'
import ShareWithUserEmail from './emails/share'

const clerkClient = createClerkClient({
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
  args: { id: v.id('documents'), emailAddresses: v.array(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
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

    const _shareTo = await clerkClient.users.getUserList({ emailAddress: args.emailAddresses })

    await ctx.scheduler.runAfter(0, internal.documentPermissions.sendShareEmails, {
      emailAddresses: args.emailAddresses,
      documentId: args.id,
    })
  },
})

export const sendShareEmails = internalAction({
  args: {
    emailAddresses: v.array(v.string()),
    documentId: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const document = await ctx.runQuery(api.documents.getById, { documentId: args.documentId })

    const RESEND_API_KEY = process.env.RESEND_API_KEY

    if (!RESEND_API_KEY) {
      throw new Error('Please add RESEND_API_KEY from Resend Dashboard to Convex')
    }

    const resend = new Resend(RESEND_API_KEY)

    for (const email of args.emailAddresses) {
      await resend.emails.send({
        from: 'EurekaPad <contact@eurekapad.app>',
        to: email,
        subject: `You have been invited to collaborate on ${document.title}`,
        react: ShareWithUserEmail({
          email: email,
          invitedByName: document.userId,
          invitedByEmail: document.userId,
          canEdit: false,
          documentName: document.title,
          inviteLink: `https://eurekapad.app/document/${document._id}`,
        }),
      })
    }
  },
})
