import styles from "./EventStatusBadge.module.css";

type EventStatusBadgeProps = {
  children: string;
  className?: string;
};

export function EventStatusBadge({ children, className }: EventStatusBadgeProps) {
  return (
    <div className={className ? `${styles.badge} ${className}` : styles.badge}>
      {children}
    </div>
  );
}
