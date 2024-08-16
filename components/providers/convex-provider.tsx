"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useTheme } from "next-themes";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap;
  console.log(resolvedTheme);

  const themeMap = {
    dark: [dark],
    light: [], // Default theme
  };

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        baseTheme: themeMap[currentTheme],
        layout: {
          socialButtonsVariant: "blockButton",
        },
      }}
    >
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
