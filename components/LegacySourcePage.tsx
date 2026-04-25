import Script from "next/script";

import { parseLegacyHtml } from "../lib/legacy-source";

type LegacySourcePageProps = {
  sourcePath: string;
  pageId: string;
  replacements: Array<[from: string, to: string]>;
};

export function LegacySourcePage({
  sourcePath,
  pageId,
  replacements,
}: LegacySourcePageProps) {
  const { bodyHtml, inlineStyles, inlineScripts } = parseLegacyHtml(
    sourcePath,
    replacements,
  );

  return (
    <>
      {inlineStyles.map((style, index) => (
        <style
          // Legacy source styles are preserved verbatim for parity.
          key={`${pageId}-style-${index}`}
          dangerouslySetInnerHTML={{ __html: style }}
        />
      ))}
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      {inlineScripts.map((script, index) => (
        <Script
          id={`${pageId}-script-${index}`}
          key={`${pageId}-script-${index}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: script }}
        />
      ))}
    </>
  );
}
