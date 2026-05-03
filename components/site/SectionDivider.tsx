import type { StyledComponentProps } from "./types";

export function SectionDivider({ cx }: StyledComponentProps) {
  return <div className={cx("section-divider")} aria-hidden="true" />;
}
