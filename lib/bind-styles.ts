export type StyleBinder = (...tokens: Array<string | false | null | undefined>) => string;

export function bindStyles(styles: Record<string, string>): StyleBinder {
  return (...tokens) =>
    tokens
      .flatMap((token) =>
        typeof token === "string" ? token.split(/\s+/).filter(Boolean) : [],
      )
      .flatMap((token) => {
        const scoped = styles[token];
        return scoped ? [scoped, token] : [token];
      })
      .join(" ");
}
