import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
};

export function Eyebrow({ children, className = "" }: EyebrowProps) {
  const classes = className ? `eyebrow ${className}` : "eyebrow";
  return <div className={classes}>{children}</div>;
}
