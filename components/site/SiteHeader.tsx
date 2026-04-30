import type { StyledComponentProps } from "./types";

type NavItem = {
  label: string;
  href: string;
  isActive?: boolean;
  isSocial?: boolean;
};

type SiteHeaderProps = {
  navItems: NavItem[];
} & StyledComponentProps;

export function SiteHeader({ navItems, cx }: SiteHeaderProps) {
  return (
    <header className={cx("site-header")}>
      <div className={cx("container")}>
        <div className={cx("brand")}>
          <div className={cx("brand-mark")}>T</div>
          <div className={cx("brand-copy")}>
            <strong>TOLK</strong>
            <span>Библия для всех: разговоры о вечном и личном</span>
          </div>
        </div>
        <nav className={cx("nav")}>
          {navItems.map((item) => {
            const className = cx(
              item.isActive ? "is-active" : "",
              item.isSocial ? "social" : "",
            );

            return (
              <a key={`${item.label}-${item.href}`} href={item.href} className={className}>
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
