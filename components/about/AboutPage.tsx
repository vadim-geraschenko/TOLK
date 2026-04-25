import Script from "next/script";

import { parseLegacyHtml } from "../../lib/legacy-source";
import { SiteFooter } from "../site/SiteFooter";
import { SiteHeader } from "../site/SiteHeader";

const aboutLegacy = parseLegacyHtml("docs/design/pages/about/source/about.html", [
  ["../home/home-mvp.html", "/"],
  ["../../home/source/assets/", "/home/assets/"],
  ["./assets/", "/about/assets/"],
]);

function extractRequiredFragment(source: string, pattern: RegExp, label: string) {
  const match = source.match(pattern);
  if (!match) {
    throw new Error(`Unable to extract ${label} from about legacy markup`);
  }

  return match[0];
}

const backgroundHtml = extractRequiredFragment(
  aboutLegacy.bodyHtml,
  /<div class="background-media"[\s\S]*?<\/div>\s*(?=<header class="site-header">)/i,
  "background media",
);

const mainHtml = extractRequiredFragment(
  aboutLegacy.bodyHtml,
  /<main>[\s\S]*<\/main>/i,
  "main content",
);

const aboutNavItems = [
  { label: "Главная", href: "/" },
  { label: "О нас", href: "#", isActive: true },
  { label: "Выпуски", href: "#" },
  { label: "Очные чтения", href: "#" },
  { label: "Мерч", href: "#" },
  { label: "Telegram", href: "#", isSocial: true },
  { label: "YouTube", href: "#", isSocial: true },
  { label: "Boosty", href: "#", isSocial: true },
];

export function AboutPage() {
  return (
    <>
      {aboutLegacy.inlineStyles.map((style, index) => (
        <style
          key={`about-style-${index}`}
          dangerouslySetInnerHTML={{ __html: style }}
        />
      ))}

      <div className="page-shell">
        <div dangerouslySetInnerHTML={{ __html: backgroundHtml }} />
        <SiteHeader navItems={aboutNavItems} />
        <div dangerouslySetInnerHTML={{ __html: mainHtml }} />
        <SiteFooter text="TOLK 2026" />
      </div>

      {aboutLegacy.inlineScripts.map((script, index) => (
        <Script
          id={`about-script-${index}`}
          key={`about-script-${index}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: script }}
        />
      ))}
    </>
  );
}
