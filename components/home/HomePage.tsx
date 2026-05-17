import { getSiteNavItems } from "../../content/navigation";
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
  const navItems = getSiteNavItems("/");

  return (
    <div className={cx("root", "page-shell")}>
      <SiteHeader navItems={navItems} />

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
