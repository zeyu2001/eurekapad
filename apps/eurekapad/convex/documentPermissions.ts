import { v } from 'convex/values'

import { api, internal } from './_generated/api'
import { action, internalMutation, mutation, query } from './_generated/server'

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
        await ctx.runMutation(internal.documentPermissions.addInviteToken, {
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
          inviteLink: `https://eurekapad.app/documents/${document._id}/invitation?token=${token}`,
          invitedByImage: identity.pictureUrl,
        })
      }
    }
  },
})

export const acceptInvite = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query('documentInviteTokens')
      .withIndex('by_token', q => q.eq('token', args.token))
      .first()

    if (!invite) {
      throw new Error('Invite not found')
    }

    const identity = await ctx.auth.getUserIdentity()

    if (!identity || !identity.email) {
      throw new Error('Not authenticated')
    }

    if (invite.email !== identity.email) {
      throw new Error('Unauthorized')
    }

    await ctx.runMutation(internal.documentPermissions.addPermissions, {
      documentId: invite.documentId,
      userId: identity.subject,
      isEditor: invite.isEditor,
    })

    await ctx.db.delete(invite._id)
  },
})

export const addPermissions = internalMutation({
  args: {
    documentId: v.id('documents'),
    userId: v.string(),
    isEditor: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existingDocument = await ctx.db.get(args.documentId)
    if (!existingDocument) {
      throw new Error('Document not found')
    }

    await ctx.db.insert('documentPermisisons', {
      documentId: args.documentId,
      userId: args.userId,
      isEditor: args.isEditor,
    })
  },
})

export const addInviteToken = internalMutation({
  args: { documentId: v.id('documents'), email: v.string(), token: v.string(), isEditor: v.boolean() },
  handler: async (ctx, args) => {
    const existingDocument = await ctx.db.get(args.documentId)
    if (!existingDocument) {
      throw new Error('Document not found')
    }

    await ctx.db.insert('documentInviteTokens', {
      documentId: args.documentId,
      email: args.email,
      isEditor: args.isEditor,
      token: args.token,
    })
  },
})
