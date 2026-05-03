import type { ElementType, ReactNode } from "react";
import type { StyledComponentProps } from "./types";

type PanelShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  as?: ElementType;
} & StyledComponentProps;

export function PanelShell({
  children,
  className = "",
  contentClassName = "",
  as: Tag = "article",
  cx,
}: PanelShellProps) {
  const panelClassName = cx("panel", className);
  const innerClassName = cx("panel-content", contentClassName);

  return (
    <Tag className={panelClassName}>
      <div className={innerClassName}>{children}</div>
    </Tag>
  );
}
