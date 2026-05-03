import type { ReactNode } from "react";
import type { StyledComponentProps } from "./types";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
} & StyledComponentProps;

export function Eyebrow({ children, className = "", cx }: EyebrowProps) {
  const classes = cx("eyebrow", className);
  return <div className={classes}>{children}</div>;
}
