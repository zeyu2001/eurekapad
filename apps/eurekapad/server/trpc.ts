import { ServerBlockNoteEditor } from '@blocknote/server-util'
import { initTRPC } from '@trpc/server'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import * as Y from 'yjs'
import { z } from 'zod'

import { CustomBlock, serverCustomSchema } from '@/components/editor/serverSchema'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { inlineCompletion } from '@/server/ai/completions'

import { transformer } from '../utils/transformer'

const t = initTRPC.create({
  transformer,
})

const publicProcedure = t.procedure

const router = t.router

const editor = ServerBlockNoteEditor.create({
  schema: serverCustomSchema,
})

export const appRouter = router({
  /**
   * Gets YDoc from a documentId and auth token
   * @param input.documentId - documentId to fetch
   * @param input.token - auth token for the user with access to the document
   * @returns {Uint8Array} - YDoc state update, which when applied to a fresh YDoc
   *  will give the same state as the document
   */
  getYDocByDocumentId: publicProcedure
    .input(
      z.object({
        documentId: z.string().pipe(z.custom<Id<'documents'>>()),
        token: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const document = await fetchQuery(api.documents.getById, { documentId: input.documentId }, { token: input.token })
      if (!document) {
        throw new Error('Document not found')
      }

      const contentUrl = await fetchQuery(
        api.documents.getContentUrl,
        {
          contentId: document.contentId,
        },
        { token: input.token },
      )
      if (!contentUrl) {
        return Y.encodeStateAsUpdate(new Y.Doc())
      }

      const response = await fetch(contentUrl)
      const blocks = (await response.json()) as CustomBlock[]

      return Y.encodeStateAsUpdate(editor.blocksToYDoc(blocks))
    }),

  /**
   * Called by the Partykit server to save the YDoc to the database
   * @param input.documentId - documentId to save
   * @param input.base64YDoc - YDoc state update, which when applied to a fresh YDoc
   *  will give the same state as the document
   * @param input.yjsToken - a shared secret between the Partykit server and the Convex server
   */
  saveYDoc: publicProcedure
    .input(
      z.object({
        documentId: z.string().pipe(z.custom<Id<'documents'>>()),
        base64YDoc: z.string(),
        yjsToken: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const uploadUrl = await fetchMutation(api.documents.generateContentUploadUrl, { yjsToken: input.yjsToken })

      const state = new Uint8Array(Buffer.from(input.base64YDoc, 'base64'))
      const doc = new Y.Doc()
      Y.applyUpdate(doc, state)
      const blocks = editor.yDocToBlocks(doc)

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: JSON.stringify(blocks),
        headers: { 'Content-Type': 'application/json' },
      })

      const { storageId } = await response.json()

      return await fetchMutation(api.documents.updateDocumentFromYjs, {
        documentId: input.documentId,
        contentId: storageId,
        yjsToken: input.yjsToken,
      })
    }),

  /**
   * Fetch inline completion suggestions
   * @param input - existing text in the node
   * @returns {string} - the suggestion to be shown
   */
  inlineCompletion: publicProcedure
    .input(
      z.object({
        currText: z.string(),
        prevBlock: z.optional(z.custom<CustomBlock>()),
        nextBlock: z.optional(z.custom<CustomBlock>()),
      }),
    )
    .mutation(async ({ input }) => {
      const prevBlockDescription = input.prevBlock
        ? `${input.prevBlock.type} - ${JSON.stringify(input.prevBlock)}`
        : 'No previous block'
      const nextBlockDescription = input.nextBlock
        ? `${input.nextBlock.type} - ${JSON.stringify(input.nextBlock)}`
        : 'No next block'
      return await inlineCompletion(input.currText, prevBlockDescription, nextBlockDescription)
    }),
})

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter
