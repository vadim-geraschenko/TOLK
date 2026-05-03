import Script from "next/script";

import { buildAboutPreinitScript } from "./aboutPreinitScript";

export function AboutPreinitScript() {
  return (
    <Script id="about-preinit-motion" strategy="beforeInteractive">
      {buildAboutPreinitScript()}
    </Script>
  );
}
