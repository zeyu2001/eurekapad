import "./globals.css";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import clsx from "clsx";
import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import { Toaster } from "sonner";

import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Scroll from "@/components/scroll";
import { EdgeStoreProvider } from "@/lib/edgestore";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "EurekaPad",
  description: "Where better, faster work happens.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Scroll />
      <body className={clsx(inter.className, lexend.variable)}>
        <EdgeStoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="eurekapad-theme-2"
          >
            <ConvexClientProvider>
              <TooltipProvider>
                <Toaster position="bottom-center" />
                <ModalProvider />
                {children}
              </TooltipProvider>
            </ConvexClientProvider>
          </ThemeProvider>
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
