import type { ReactNode } from "react";
import type { StyledComponentProps } from "./types";

type CardKickerProps = {
  label: ReactNode;
  hasLines?: boolean;
} & StyledComponentProps;

export function CardKicker({ label, hasLines = false, cx }: CardKickerProps) {
  const className = cx("card-kicker", hasLines ? "has-lines" : "");

  return (
    <div className={className}>
      <span className={cx("card-kicker-label")}>{label}</span>
    </div>
  );
}
