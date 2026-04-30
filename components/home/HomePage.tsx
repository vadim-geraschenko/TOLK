import { bindStyles } from "../../lib/bind-styles";
import { SiteFooter } from "../site/SiteFooter";
import { SiteHeader } from "../site/SiteHeader";
import { SectionDivider } from "../site/SectionDivider";
import styles from "./home.module.css";
import {
  HomeBottomSections,
  HomeEpisodesSection,
  HomeHeroSection,
  HomeParticipantsSection,
} from "./sections";

export function HomePage() {
  const cx = bindStyles(styles);
  const navItems = [
    { label: "Главная", href: "#", isActive: true },
    { label: "О нас", href: "/about" },
    { label: "Выпуски", href: "#" },
    { label: "Очные чтения", href: "#" },
    { label: "Мерч", href: "#" },
    { label: "Telegram", href: "#", isSocial: true },
    { label: "YouTube", href: "#", isSocial: true },
    { label: "Boosty", href: "#", isSocial: true },
  ];

  return (
    <div className={cx("root", "page-shell")}>
      <SiteHeader navItems={navItems} cx={cx} />

      <main>
        <HomeHeroSection />
        <SectionDivider cx={cx} />
        <HomeParticipantsSection />
        <SectionDivider cx={cx} />
        <HomeEpisodesSection />
        <SectionDivider cx={cx} />
        <HomeBottomSections />
      </main>

      <SiteFooter text="TOLK 2026" cx={cx} />
    </div>
  );
}
