import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/android-chrome-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#006400" />
        <meta
          name="description"
          content="A simple todo app built with Next.js"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>The Next.js ToDo App - Stay Organized with ToDo Lists</title>
        <meta name="author" content="Son Nguyen" />
        <meta name="robots" content="index, follow" />
        <meta charSet="utf-8" />
        <meta name="keywords" content="nextjs, todo, app" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@nextjstodoapp" />
        <meta name="twitter:title" content="The Next.js ToDo App" />
        <meta
          name="twitter:description"
          content="A simple todo app built with Next.js"
        />
        <meta property="og:title" content="The Next.js ToDo App" />
        <meta
          property="og:description"
          content="A simple todo app built with Next.js"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://todo-app-nextjs-stack.vercel.app/"
        />
        <meta property="og:image" content="/android-chrome-512x512.png" />
        <meta property="og:site_name" content="The Next.js ToDo App" />
        <meta property="og:locale" content="en_US" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
