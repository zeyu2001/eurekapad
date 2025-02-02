import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { migrationsTable } from 'convex-helpers/server/migrations'

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id('documents')),
    content: v.optional(v.string()), // deprecated
    contentId: v.optional(v.id('_storage')),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  })
    .index('by_user', ['userId'])
    .index('by_user_parent', ['userId', 'parentDocument']),
  documentPermisisons: defineTable({
    documentId: v.id('documents'),
    userId: v.string(),
    canEdit: v.boolean(),
  })
    .index('by_user', ['userId'])
    .index('by_document', ['documentId']),
  migrations: migrationsTable,
})
