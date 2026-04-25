import type { ElementType, ReactNode } from "react";

type PanelShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  as?: ElementType;
};

export function PanelShell({
  children,
  className = "",
  contentClassName = "",
  as: Tag = "article",
}: PanelShellProps) {
  const panelClassName = className ? `panel ${className}` : "panel";
  const innerClassName = contentClassName ? `panel-content ${contentClassName}` : "panel-content";

  return (
    <Tag className={panelClassName}>
      <div className={innerClassName}>{children}</div>
    </Tag>
  );
}
