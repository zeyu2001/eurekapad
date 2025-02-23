import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";
import { trpc } from "./trpc";
import * as Y from "yjs";

export default class YjsServer implements Party.Server {
  constructor(public party: Party.Room) {}
  static async onBeforeConnect(request: Party.Request) {
    const token = new URL(request.url).searchParams.get("token") ?? "";
    const documentId =
      new URL(request.url).searchParams.get("documentId") ?? "";
    request.headers.set("X-Document-ID", documentId);
    request.headers.set("X-Auth-Token", token);
    console.log("Document ID", documentId);
    return request;
  }

  onConnect(conn: Party.Connection, { request }: Party.ConnectionContext) {
    return onConnect(conn, this.party, {
      // persist: { mode: "snapshot" },
      load: async () => {
        const documentId = request.headers.get("X-Document-ID")!;
        const token = request.headers.get("X-Auth-Token")!;

        // Public demo, etc.
        if (!documentId || !token) {
          return new Y.Doc();
        }

        const state = await trpc.getYDocByDocumentId.fetch({
          documentId: documentId,
          token: token,
        });

        const ydoc = new Y.Doc();
        Y.applyUpdate(ydoc, state);
        console.log(ydoc.getXmlFragment("prosemirror").toJSON());
        return ydoc;
      },
    });
  }
}
