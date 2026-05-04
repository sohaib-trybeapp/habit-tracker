import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { BottomNav } from "@/components/BottomNav";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Habits",
  description: "Track your daily habits and build streaks",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Habits",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F2F7" },
    { media: "(prefers-color-scheme: dark)",  color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ConvexClientProvider>
          <main className="flex-1 pb-safe-nav">{children}</main>
          <BottomNav />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: "14px",
                fontSize: "15px",
                fontWeight: "500",
              },
            }}
          />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
