import { v } from 'convex/values'

import { api, internal } from './_generated/api'
import { action, internalMutation, query } from './_generated/server'

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

export const getUserPermissions = query({
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

    if (document.userId === userId) {
      return {
        isViewer: true,
        isEditor: true,
        isOwner: true,
      }
    }

    const permissions = await ctx.db
      .query('documentPermisisons')
      .withIndex('by_document', q => q.eq('documentId', args.documentId))
      .filter(q => q.eq(q.field('userId'), userId))
      .first()

    return {
      isViewer: !!permissions,
      isEditor: permissions?.isEditor || false,
      isOwner: false,
    }
  },
})

export const share = action({
  args: { id: v.id('documents'), shares: v.array(v.object({ email: v.string(), isEditor: v.boolean() })) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity || !identity.email) {
      throw new Error('Not authenticated')
    }

    const userId = identity.subject
    const existingDocument = await ctx.runQuery(api.documents.getById, {
      documentId: args.id,
    })

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    }
    const document = await ctx.runQuery(api.documents.getById, { documentId: args.id })
    if (!document) {
      throw new Error('Document not found')
    }

    for (const share of args.shares) {
      const shareToUserId = await ctx.runAction(internal.utils.users.getUserFromEmail, { email: share.email })

      if (shareToUserId) {
        await ctx.runMutation(internal.documentPermissions.addPermissions, {
          documentId: args.id,
          userId: shareToUserId,
          isEditor: share.isEditor,
        })

        await ctx.scheduler.runAfter(0, internal.emails.actions.sendShareEmail, {
          email: share.email,
          isEditor: share.isEditor,
          invitedByEmail: identity.email,
          invitedByName: identity.name || identity.email,
          documentTitle: document.title,
          inviteLink: `https://eurekapad.app/documents/${document._id}`,
          invitedByImage: identity.pictureUrl,
        })
      } else {
        const token = crypto.randomUUID()
        await ctx.runMutation(internal.documentPermissions.addPermissions, {
          documentId: args.id,
          email: share.email,
          token: token,
          isEditor: share.isEditor,
        })

        await ctx.scheduler.runAfter(0, internal.emails.actions.sendShareEmail, {
          email: share.email,
          isEditor: share.isEditor,
          invitedByEmail: identity.email,
          invitedByName: identity.name || identity.email,
          documentTitle: document.title,
          inviteLink: `https://eurekapad.app/documents/${document._id}?token=${token}`,
          invitedByImage: identity.pictureUrl,
        })
      }
    }
  },
})

export const addPermissions = internalMutation({
  args: {
    documentId: v.id('documents'),
    userId: v.optional(v.string()),
    email: v.optional(v.string()),
    token: v.optional(v.string()),
    isEditor: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existingDocument = await ctx.db.get(args.documentId)
    if (!existingDocument) {
      throw new Error('Document not found')
    }

    if (args.userId) {
      await ctx.db.insert('documentPermisisons', {
        documentId: args.documentId,
        userId: args.userId,
        isEditor: args.isEditor,
      })
    } else if (args.email && args.token) {
      const token = crypto.randomUUID()
      await ctx.db.insert('documentInviteTokens', {
        documentId: args.documentId,
        email: args.email,
        isEditor: args.isEditor,
        token: token,
      })
    } else {
      throw new Error('Invalid arguments, need either userId or email and token')
    }
  },
})
