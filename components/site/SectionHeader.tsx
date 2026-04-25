import type { ReactNode } from "react";

type SectionHeaderProps = {
  content: ReactNode;
  action?: ReactNode;
};

export function SectionHeader({ content, action }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>{content}</div>
      {action ?? null}
    </div>
  );
}
