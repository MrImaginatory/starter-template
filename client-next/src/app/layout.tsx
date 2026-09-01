import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ClientLayout } from "@/components/client-layout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_TITLE || "ExoLayout",
  description:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    "A production-ready React component library",
  icons: {
    icon: process.env.NEXT_PUBLIC_APP_FAVICON || "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fafafa" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#09090b" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <ClientLayout />
        </Providers>
        <Script
          id="theme-flash-prevention"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem('starter-kit-theme')
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                  var dark = stored === 'dark' || ((stored === null || stored === 'system') && prefersDark)
                  document.documentElement.classList.toggle('dark', dark)
                } catch (e) {}
              })()
            `,
          }}
        />
      </body>
    </html>
  );
}
