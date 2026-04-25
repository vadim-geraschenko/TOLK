type NavItem = {
  label: string;
  href: string;
  isActive?: boolean;
  isSocial?: boolean;
};

type SiteHeaderProps = {
  navItems: NavItem[];
};

export function SiteHeader({ navItems }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="container">
        <div className="brand">
          <div className="brand-mark">T</div>
          <div className="brand-copy">
            <strong>TOLK</strong>
            <span>Библия для всех: разговоры о вечном и личном</span>
          </div>
        </div>
        <nav className="nav">
          {navItems.map((item) => {
            const className = [
              item.isActive ? "is-active" : "",
              item.isSocial ? "social" : "",
            ]
              .filter(Boolean)
              .join(" ");

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
