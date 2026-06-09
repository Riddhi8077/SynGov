import type { Metadata, Viewport } from "next";
import { Sora, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientInteractions from "@/components/ClientInteractions";
import RealtimeInjector from "@/components/RealtimeInjector";

const fontDisplay = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  preload: false,
});

const fontBody = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  preload: false,
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#09090b"
};

export const metadata: Metadata = {
  title: "SynGov — Governance That Works for Everyone",
  description: "SynGov gives your college club the structure to make decisions together — fairly, transparently, and without drama. AI-powered proposals, weighted voting, blockchain transparency.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SynGov"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='28' font-size='28'>⚡</text></svg>" />
      </head>
      <body suppressHydrationWarning className={`${fontBody.variable} ${fontDisplay.variable} ${fontMono.variable} antialiased`}>
        <RealtimeInjector />
        <ClientInteractions />
        {children}
      </body>
    </html>
  );
}
