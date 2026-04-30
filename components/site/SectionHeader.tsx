import type { ReactNode } from "react";
import type { StyledComponentProps } from "./types";

type SectionHeaderProps = {
  content: ReactNode;
  action?: ReactNode;
} & StyledComponentProps;

export function SectionHeader({ content, action, cx }: SectionHeaderProps) {
  return (
    <div className={cx("section-header")}>
      <div>{content}</div>
      {action ?? null}
    </div>
  );
}
