/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import { ServerBlockNoteEditor } from '@blocknote/server-util'
import * as trpcNext from '@trpc/server/adapters/next'
import * as Y from 'yjs'
import { z } from 'zod'

import { CustomBlock, serverCustomSchema } from '@/components/editor/serverSchema'
import { publicProcedure, router } from '@/server/trpc'

const appRouter = router({
  blocksToYDoc: publicProcedure.input(z.array(z.custom<CustomBlock>())).query(async ({ input }) => {
    const editor = ServerBlockNoteEditor.create({
      schema: serverCustomSchema,
    })

    return Y.encodeStateAsUpdate(editor.blocksToYDoc(input))
  }),
})

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
})
