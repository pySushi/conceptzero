// app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "sonner";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Concept Zero - Unlock Next-Gen AI Experiences",
  description:
    "Explore the concept library on AI interactions to get inspiration for your next AI-powered project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="light"
      style={{ colorScheme: "light" }}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased text-gray-900 font-sans bg-white`}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          {/* Footer Links */}
          <div className="mt-16 flex flex-col items-center gap-4 md:mt-20 md:flex-row md:justify-center">
            <Link
              href="https://www.linkedin.com/in/shouches/"
              target="_blank"
              className="inline-flex items-center gap-0.5 text-sm text-muted-foreground hover:underline"
            >
              Created by Sudeep Shouche
              {/* Removed SVG */}
            </Link>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
