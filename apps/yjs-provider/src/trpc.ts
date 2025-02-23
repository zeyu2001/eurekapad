import type { AppRouter } from "@eurekapad/app/trpc";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";

const proxyClient = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/api/trpc"
          : `${process.env.VERCEL_URL}/api/trpc`,
    }),
  ],
});

export const trpc = createServerSideHelpers({
  client: proxyClient,
});
