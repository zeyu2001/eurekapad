import { verifyToken } from "@clerk/backend";
import { Buffer } from "buffer";
import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";
import * as Y from "yjs";

import { trpcClientFactory } from "./trpc";

export default class YjsServer implements Party.Server {
  constructor(public party: Party.Room) {}
  static async onBeforeConnect(request: Party.Request, lobby: Party.Lobby) {
    const token = new URL(request.url).searchParams.get("token") ?? "";
    const documentId =
      new URL(request.url).searchParams.get("documentId") ?? "";

    if (!token || !documentId) {
      return new Response("Bad Request", { status: 400 });
    }

    try {
      const issuer = lobby.env.CLERK_ENDPOINT!;
      const session = await verifyToken(token, {
        issuer,
        jwtKey: lobby.env.CLERK_JWT_KEY!,
      });

      request.headers.set("X-Document-ID", documentId);
      request.headers.set("X-Auth-Token", token);
      request.headers.set("X-Auth-User-ID", session.sub);
      request.headers.set("X-Yjs-Api-Token", lobby.env.YJS_API_TOKEN!);
      request.headers.set(
        "X-Trpc-Api-Url",
        lobby.env.TRPC_API_URL ?? "http://localhost:3000",
      );
      request.headers.set(
        "X-Vercel-Protection-Bypass",
        lobby.env.VERCEL_PROTECTION_BYPASS!,
      );

      return request;
    } catch {
      // auth failed
      return new Response("Unauthorized", { status: 401 });
    }
  }

  onConnect(conn: Party.Connection, { request }: Party.ConnectionContext) {
    return onConnect(conn, this.party, {
      // persist: { mode: "snapshot" },
      load: async () => {
        const documentId = request.headers.get("X-Document-ID")!;
        const token = request.headers.get("X-Auth-Token")!;
        const trpcApiUrl = request.headers.get("X-Trpc-Api-Url")!;
        const vercelToken = request.headers.get("X-Vercel-Protection-Bypass")!;

        const state = await trpcClientFactory(
          trpcApiUrl,
          vercelToken,
          token,
        ).getYDocByDocumentId.query({
          documentId: documentId,
        });

        const ydoc = new Y.Doc();
        Y.applyUpdate(ydoc, state);
        return ydoc;
      },

      callback: {
        async handler(yDoc) {
          const documentId = request.headers.get("X-Document-ID")!;
          const yjsApiToken = request.headers.get("X-Yjs-Api-Token")!;
          const trpcApiUrl = request.headers.get("X-Trpc-Api-Url")!;
          const vercelToken = request.headers.get(
            "X-Vercel-Protection-Bypass",
          )!;

          const update = Y.encodeStateAsUpdate(yDoc);
          const base64YDoc = Buffer.from(update).toString("base64");

          console.log("Saving document", documentId);

          await trpcClientFactory(trpcApiUrl, vercelToken).saveYDoc.mutate({
            documentId,
            base64YDoc,
            yjsToken: yjsApiToken,
          });

          console.log("Saved document", documentId);
        },
        // only save after every 2 seconds
        debounceWait: 2000,
        // if updates keep coming, save at least once every 10 seconds
        debounceMaxWait: 10000,
      },
    });
  }
}
