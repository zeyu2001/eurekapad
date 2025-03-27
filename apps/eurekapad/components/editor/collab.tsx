import YPartyKitProvider from 'y-partykit/provider'
import * as Y from 'yjs'

import { generateAnimalName, generateCursorColor } from '@/components/editor/random'

export const newCollabProvider = (documentId: string, authToken: string, username?: string | null) => {
  const doc = new Y.Doc()

  return {
    provider: new YPartyKitProvider(
      process.env.NEXT_PUBLIC_YPARTYKIT_HOST ?? 'localhost:1999',
      documentId || 'default',
      doc,
      {
        params: {
          token: authToken,
          documentId,
        },
      },
    ),
    fragment: doc.getXmlFragment('prosemirror'),
    user: {
      name: username ?? `Anonymous ${generateAnimalName()}`,
      color: generateCursorColor(),
    },
    // showCursorLabels: 'always',
  }
}
