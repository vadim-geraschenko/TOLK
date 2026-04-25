import fs from "node:fs";
import path from "node:path";

export type LegacyReplacement = [from: string, to: string];

export type ParsedLegacyHtml = {
  bodyHtml: string;
  inlineStyles: string[];
  inlineScripts: string[];
};

function applyReplacements(input: string, replacements: LegacyReplacement[]) {
  const orderedReplacements = [...replacements].sort(
    (left, right) => right[0].length - left[0].length,
  );

  return orderedReplacements.reduce(
    (output, [from, to]) => output.split(from).join(to),
    input,
  );
}

function extractMatches(source: string, regex: RegExp) {
  return Array.from(source.matchAll(regex), (match) => match[1]?.trim() ?? "").filter(
    Boolean,
  );
}

export function parseLegacyHtml(
  sourcePath: string,
  replacements: LegacyReplacement[],
): ParsedLegacyHtml {
  const absolutePath = path.join(process.cwd(), sourcePath);
  const source = fs.readFileSync(absolutePath, "utf8");

  const bodyMatch = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    throw new Error(`Body not found in ${sourcePath}`);
  }

  const inlineStyles = extractMatches(source, /<style[^>]*>([\s\S]*?)<\/style>/gi).map(
    (style) => applyReplacements(style, replacements),
  );
  const inlineScripts = extractMatches(
    bodyMatch[1],
    /<script[^>]*>([\s\S]*?)<\/script>/gi,
  ).map((script) => applyReplacements(script, replacements));

  const bodyWithoutScripts = bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, "");
  const bodyHtml = applyReplacements(bodyWithoutScripts, replacements);

  return {
    bodyHtml,
    inlineStyles,
    inlineScripts,
  };
}

export function getLegacyInlineStyles(
  sourcePath: string,
  replacements: LegacyReplacement[] = [],
) {
  return parseLegacyHtml(sourcePath, replacements).inlineStyles;
}
