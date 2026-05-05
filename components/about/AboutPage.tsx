import { bindStyles } from "../../lib/bind-styles";
import { AboutMotion } from "./AboutMotion";
import {
  AboutAudienceSection,
  AboutClosingSection,
  AboutHeroSection,
  AboutStorySection,
  AboutStoryLeadSection,
  AboutVoicesSection,
} from "./sections";
import { SiteFooter } from "../site/SiteFooter";
import { SiteHeader } from "../site/SiteHeader";
import { withBasePath } from "../../lib/base-path";
import styles from "./about.module.css";

const cx = bindStyles(styles);

const aboutNavItems = [
  { label: "Главная", href: "/" },
  { label: "О нас", href: "#", isActive: true },
  { label: "Выпуски", href: "/episodes" },
  { label: "Очные чтения", href: "#" },
  { label: "Мерч", href: "#" },
  { label: "Telegram", href: "#", isSocial: true },
  { label: "YouTube", href: "#", isSocial: true },
  { label: "Boosty", href: "#", isSocial: true },
];

function AboutBackgroundMedia() {
  return (
    <div className={cx("background-media")} aria-hidden="true">
      <img
        className={cx("background-frame")}
        data-about-frame
        data-about-reveal-target
        alt=""
        suppressHydrationWarning
      />
      <div
        className={cx("background-cloud-wrap", "cloud-left")}
        data-about-cloud="left"
        data-about-reveal-target
      >
        <img
          className={cx("background-cloud")}
          src={withBasePath("/about/assets/clouds.webp")}
          alt=""
          width={1920}
          height={1280}
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <div
        className={cx("background-cloud-wrap", "cloud-right")}
        data-about-cloud="right"
        data-about-reveal-target
      >
        <img
          className={cx("background-cloud")}
          src={withBasePath("/about/assets/clouds.webp")}
          alt=""
          width={1920}
          height={1280}
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <div className={cx("background-grain")} />
    </div>
  );
}

function AboutBootOverlay() {
  return (
    <div className={cx("boot-overlay")} data-about-boot-overlay aria-hidden="true">
      <div className={cx("boot-loader")} />
    </div>
  );
}

export function AboutPage() {
  return (
    <div className={cx("root", "page-shell")} data-about-root>
      <AboutBackgroundMedia />
      <AboutBootOverlay />
      <SiteHeader navItems={aboutNavItems} />
      <main>
        <AboutHeroSection />
        <AboutStoryLeadSection />
        <AboutStorySection />
        <AboutVoicesSection />
        <AboutAudienceSection />
        <AboutClosingSection />
      </main>
      <SiteFooter text="TOLK 2026" cx={cx} />
      <AboutMotion />
    </div>
  );
}
