import { v } from 'convex/values'
import { makeMigration } from 'convex-helpers/server/migrations'

import { internal } from './_generated/api'
import { internalAction, internalMutation, internalQuery } from './_generated/server'

const migration = makeMigration(internalMutation, {
  migrationTable: 'migrations',
})

export const getDocuments = internalQuery({
  handler: async ctx => {
    return await ctx.db.query('documents').collect()
  },
})

export const updateContentStorageId = internalMutation({
  args: {
    id: v.id('documents'),
    contentId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      contentId: args.contentId,
    })
  },
})

export const migrateContentToFiles = internalAction({
  handler: async ctx => {
    const documents = await ctx.runQuery(internal.migrations.getDocuments)

    for (const document of documents) {
      if (!document.content) {
        continue
      }

      try {
        JSON.parse(document.content)
        const blob = new Blob([document.content], { type: 'application/json' })
        const storageId = await ctx.storage.store(blob)
        await ctx.runMutation(internal.migrations.updateContentStorageId, {
          id: document._id,
          contentId: storageId,
        })
      } catch {
        continue
      }
    }
  },
})

export const deprecateContent = migration({
  table: 'documents',
  migrateOne: async (ctx, document) => {
    if (document.contentId) {
      ctx.db.patch(document._id, {
        content: undefined,
      })
    } else if (document.content) {
      throw new Error('Run migrateContentToFiles first')
    }
  },
})
