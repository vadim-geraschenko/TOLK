import Link from "next/link";
import styles from "./button.module.css";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  mini?: boolean;
  className?: string;
};

export function Button({ href, children, mini = false, className }: ButtonProps) {
  return (
    <Link
      href={href}
      className={[styles.button, mini ? styles.mini : "", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={styles.buttonLabel}>{children}</span>
      <span className={styles.stars}>
        <span className={`${styles.star} ${styles.starLg} ${styles.star1}`} />
        <span className={`${styles.star} ${styles.starSm} ${styles.star2}`} />
        <span className={`${styles.star} ${styles.starLg} ${styles.star3}`} />
        <span className={`${styles.star} ${styles.starSm} ${styles.star4}`} />
        <span className={`${styles.star} ${styles.starLg} ${styles.star5}`} />
        <span className={`${styles.star} ${styles.starSm} ${styles.star6}`} />
        <span className={`${styles.star} ${styles.starSm} ${styles.star7}`} />
      </span>
    </Link>
  );
}
