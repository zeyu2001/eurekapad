import { ServerBlockNoteEditor } from '@blocknote/server-util'
import { initTRPC } from '@trpc/server'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import * as Y from 'yjs'
import { z } from 'zod'

import { CustomBlock, serverCustomSchema } from '@/components/editor/serverSchema'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

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
  blocksToYDoc: publicProcedure.input(z.array(z.custom<CustomBlock>())).query(async ({ input }) => {
    const editor = ServerBlockNoteEditor.create({
      schema: serverCustomSchema,
    })

    return Y.encodeStateAsUpdate(editor.blocksToYDoc(input))
  }),

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
})

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter
