import type { ReactNode } from "react";

type CardKickerProps = {
  label: ReactNode;
  hasLines?: boolean;
};

export function CardKicker({ label, hasLines = false }: CardKickerProps) {
  const className = hasLines ? "card-kicker has-lines" : "card-kicker";

  return (
    <div className={className}>
      <span className="card-kicker-label">{label}</span>
    </div>
  );
}
