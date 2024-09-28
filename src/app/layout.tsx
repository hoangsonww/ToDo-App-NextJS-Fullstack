// src/app/layout.tsx
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "The Next.js ToDo App",
  description: "A simple todo app built with Next.js",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      {/* Favicon Links */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/android-chrome-192x192.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#006400" />
    </head>
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <Analytics />
      {children}
    </body>
    </html>
  );
}
