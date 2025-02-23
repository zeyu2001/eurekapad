import { ServerBlockNoteEditor } from '@blocknote/server-util'
import { initTRPC } from '@trpc/server'
import axios from 'axios'
import { fetchQuery } from 'convex/nextjs'
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

      console.log('document', document)

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

      const { data } = await axios.get(contentUrl, { responseType: 'json' })
      const blocks = data as CustomBlock[]

      console.log('blocks', blocks)

      const editor = ServerBlockNoteEditor.create({
        schema: serverCustomSchema,
      })

      return Y.encodeStateAsUpdate(editor.blocksToYDoc(blocks))
    }),
})

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter
