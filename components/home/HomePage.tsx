import { getLegacyInlineStyles } from "../../lib/legacy-source";
import { SiteFooter } from "../site/SiteFooter";
import { SiteHeader } from "../site/SiteHeader";
import { SectionDivider } from "../site/SectionDivider";
import {
  HomeBottomSections,
  HomeEpisodesSection,
  HomeHeroSection,
  HomeParticipantsSection,
} from "./sections";

const homeInlineStyles = getLegacyInlineStyles("docs/design/pages/home/source/home-mvp.html");

export function HomePage() {
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
    <>
      {homeInlineStyles.map((style, index) => (
        <style
          key={`home-style-${index}`}
          dangerouslySetInnerHTML={{ __html: style }}
        />
      ))}

      <div className="page-shell">
        <SiteHeader navItems={navItems} />

        <main>
          <HomeHeroSection />
          <SectionDivider />
          <HomeParticipantsSection />
          <SectionDivider />
          <HomeEpisodesSection />
          <SectionDivider />
          <HomeBottomSections />
        </main>

        <SiteFooter text="TOLK 2026" />
      </div>
    </>
  );
}
