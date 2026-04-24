import styles from "./cardKicker.module.css";

export function CardKicker({
  children,
  lines = false,
  variant = "plain",
  className,
}: {
  children: React.ReactNode;
  lines?: boolean;
  variant?: "plain" | "eyebrow";
  className?: string;
}) {
  return (
    <div
      className={[
        styles.kicker,
        lines ? styles.lines : "",
        variant === "eyebrow" ? styles.eyebrow : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={styles.label}>{children}</span>
    </div>
  );
}
