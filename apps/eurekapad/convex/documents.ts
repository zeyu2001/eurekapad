import { v } from 'convex/values'

import { api } from './_generated/api'
import { Doc, Id } from './_generated/dataModel'
import { mutation, query } from './_generated/server'
import { authAndGetDocument } from './utils/documents'

export const archive = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const userId = identity.subject

    const existingDocument = await authAndGetDocument(ctx, args.id, true)

    const recursiveArchive = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', q => q.eq('userId', userId).eq('parentDocument', documentId))
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        })

        await recursiveArchive(child._id)
      }
    }

    const document = await ctx.db.patch(existingDocument._id, {
      isArchived: true,
    })

    recursiveArchive(existingDocument._id)

    return document
  },
})

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const userId = identity.subject

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user_parent', q => q.eq('userId', userId).eq('parentDocument', args.parentDocument))
      .filter(q => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect()

    return documents
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const userId = identity.subject

    const document = await ctx.db.insert('documents', {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    })

    return document
  },
})

export const getTrash = query({
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const userId = identity.subject

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', q => q.eq('userId', userId))
      .filter(q => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect()

    return documents
  },
})

export const restore = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const userId = identity.subject

    const existingDocument = await authAndGetDocument(ctx, args.id, true)

    const recursiveRestore = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', q => q.eq('userId', userId).eq('parentDocument', documentId))
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        })

        await recursiveRestore(child._id)
      }
    }

    const options: Partial<Doc<'documents'>> = {
      isArchived: false,
    }

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument)
      if (parent?.isArchived) {
        options.parentDocument = undefined
      }
    }

    const document = await ctx.db.patch(args.id, options)

    recursiveRestore(args.id)

    return document
  },
})

export const remove = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const existingDocument = await authAndGetDocument(ctx, args.id, true)

    // delete the stored content
    if (existingDocument.contentId) {
      try {
        await ctx.storage.delete(existingDocument.contentId)
      } catch (error) {
        console.error('Failed to delete content', error)
      }
    }
    const document = await ctx.db.delete(args.id)

    return document
  },
})

export const getSearch = query({
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const userId = identity.subject

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', q => q.eq('userId', userId))
      .filter(q => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect()

    return documents
  },
})

export const getById = query({
  args: { documentId: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    const document = await ctx.db.get(args.documentId)

    if (!document) {
      return null
    }

    if (document.isPublished && !document.isArchived) {
      return document
    }

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const userId = identity.subject

    if (document.userId !== userId) {
      const permissions = await ctx.runQuery(api.documentPermissions.getUserPermissions, {
        documentId: args.documentId,
      })

      if (!permissions.isViewer) {
        return null
      }
    }

    return document
  },
})

export const update = mutation({
  args: {
    id: v.id('documents'),
    title: v.optional(v.string()),
    contentId: v.optional(v.id('_storage')),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args

    const existingDocument = await authAndGetDocument(ctx, id, true)

    // replace old content and delete it
    if (args.contentId && existingDocument.contentId) {
      try {
        await ctx.storage.delete(existingDocument.contentId)
      } catch (error) {
        console.error('Failed to delete old content', error)
      }
    }
    const document = await ctx.db.patch(args.id, {
      ...rest,
    })

    return document
  },
})

export const generateContentUploadUrl = mutation({
  args: {
    yjsToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity && args.yjsToken !== process.env.YJS_API_TOKEN) {
      throw new Error('Unauthenticated')
    }

    const uploadUrl = await ctx.storage.generateUploadUrl()

    return uploadUrl
  },
})

export const getContentUrl = query({
  args: { contentId: v.optional(v.id('_storage')) },
  handler: async (ctx, args) => {
    if (!args.contentId) {
      return null
    }
    return await ctx.storage.getUrl(args.contentId)
  },
})

export const updateDocumentFromYjs = mutation({
  args: {
    documentId: v.id('documents'),
    contentId: v.id('_storage'),
    yjsToken: v.string(),
  },
  handler: async (ctx, args) => {
    const existingDocument = await ctx.db.get(args.documentId)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (args.yjsToken !== process.env.YJS_API_TOKEN) {
      throw new Error('Unauthorized')
    }

    const currentContentId = existingDocument.contentId
    if (currentContentId) {
      await ctx.storage.delete(currentContentId)
    }

    const document = await ctx.db.patch(args.documentId, {
      contentId: args.contentId,
    })

    return document
  },
})

export const removeIcon = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Unauthenticated')
    }

    const existingDocument = await authAndGetDocument(ctx, args.id, true)

    const document = await ctx.db.patch(existingDocument._id, {
      icon: undefined,
    })

    return document
  },
})

export const removeCoverImage = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Unauthenticated')
    }

    const existingDocument = await authAndGetDocument(ctx, args.id, true)

    const document = await ctx.db.patch(existingDocument._id, {
      coverImage: undefined,
    })

    return document
  },
})
