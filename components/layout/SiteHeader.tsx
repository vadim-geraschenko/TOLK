import Link from "next/link";
import { primaryNavigation } from "../../content/navigation";
import styles from "./siteHeader.module.css";

export function SiteHeader({ currentPath }: { currentPath: "/" | "/about" }) {
  return (
    <header className={styles.siteHeader}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>T</div>
          <div className={styles.brandCopy}>
            <strong>TOLK</strong>
            <span>Библия для всех: разговоры о вечном и личном</span>
          </div>
        </div>
        <nav className={styles.nav}>
          {primaryNavigation.map((item) => {
            const isActive = item.href === currentPath;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={[
                  styles.navLink,
                  isActive ? styles.active : "",
                  item.social ? styles.social : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
