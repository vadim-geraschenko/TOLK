import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AboutPreinitScript } from "../components/about/motion/AboutPreinitScript";
import { withBasePath } from "../lib/base-path";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vadim-geraschenko.github.io"),
  title: "TOLK",
  description: "Библия для всех: разговоры о вечном и личном",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <AboutPreinitScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Source+Sans+3:wght@500;600;700&display=swap"
        />
        <link rel="icon" href={withBasePath("/favicon.svg")} type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
