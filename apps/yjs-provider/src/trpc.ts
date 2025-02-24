import { type AppRouter } from "@eurekapad/app/trpc";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

// Use the vanilla tRPC client to call the API on our main app server
// https://trpc.io/docs/v10/client/vanilla
export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/api/trpc"
          : "https://eurekapad.app/api/trpc",
    }),
  ],
});
