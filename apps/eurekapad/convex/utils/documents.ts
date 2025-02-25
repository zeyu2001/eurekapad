import { Id } from '../_generated/dataModel'
import { MutationCtx, QueryCtx } from '../_generated/server'

export const authAndGetDocument = async (
  ctx: QueryCtx | MutationCtx,
  documentId: Id<'documents'>,
  mustBeOwner = false,
) => {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new Error('Not authenticated')
  }

  const userId = identity.subject
  const document = await ctx.db.get(documentId)

  if (!document) {
    throw new Error('Not found')
  }

  if (document.userId !== userId) {
    if (mustBeOwner) {
      throw new Error('Unauthorized')
    }

    const permissions = await ctx.db
      .query('documentPermisisons')
      .withIndex('by_document', q => q.eq('documentId', documentId))
      .filter(q => q.eq(q.field('userId'), userId))
      .first()

    if (!permissions) {
      throw new Error('Unauthorized')
    }
  }

  return document
}
