import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { withBasePath } from "../lib/base-path";

import "./globals.css";

const cormorantGaramond = localFont({
  src: [
    {
      path: "./fonts/cormorant-garamond-cyrillic.woff2",
      weight: "500 600",
      style: "normal",
    },
    {
      path: "./fonts/cormorant-garamond-latin.woff2",
      weight: "500 600",
      style: "normal",
    },
  ],
  variable: "--font-cormorant-garamond",
  display: "swap",
  preload: false,
});

const sourceSans = localFont({
  src: [
    {
      path: "./fonts/source-sans-3-cyrillic.woff2",
      weight: "500 700",
      style: "normal",
    },
    {
      path: "./fonts/source-sans-3-latin.woff2",
      weight: "500 700",
      style: "normal",
    },
  ],
  variable: "--font-source-sans-3",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vadim-geraschenko.github.io"),
  title: "TOLK",
  description: "Библия для всех: разговоры о вечном и личном",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${cormorantGaramond.variable} ${sourceSans.variable}`}>
      <head>
        <link rel="icon" href={withBasePath("/favicon.svg")} type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
