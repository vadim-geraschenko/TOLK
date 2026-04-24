import { CardKicker } from "./CardKicker";

export function SectionHead({
  kicker,
  title,
  lines = false,
  variant = "plain",
  className,
}: {
  kicker: string;
  title: string;
  lines?: boolean;
  variant?: "plain" | "eyebrow";
  className?: string;
}) {
  return (
    <div className={className}>
      <CardKicker lines={lines} variant={variant}>
        {kicker}
      </CardKicker>
      <h2>{title}</h2>
    </div>
  );
}
