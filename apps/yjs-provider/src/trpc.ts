import { type AppRouter } from "@eurekapad/app/trpc";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

// Use the vanilla tRPC client to call the API on our main app server
// https://trpc.io/docs/v10/client/vanilla
export const trpcClientFactory = (baseUrl: string, vercelToken: string) => {
  console.log("tRPC API URL: ", baseUrl);

  return createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: `${baseUrl}/api/trpc`,
        headers: () => ({
          "x-vercel-protection-bypass": vercelToken,
        }),
      }),
    ],
  });
};
